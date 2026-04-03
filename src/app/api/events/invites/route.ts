import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getEventBySlug } from "@/config/events";
import { getInviteList } from "@/lib/google-sheets";
import { google } from "googleapis";

const ADMIN_COOKIE = "rimsom_admin_token";
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || "changeme";

function validateToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  if (sig !== expected) return false;
  const timestamp = parseInt(payload.split("_")[0], 10);
  return Date.now() - timestamp < 24 * 60 * 60 * 1000;
}

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return token && validateToken(token);
}

function getSheets() {
  const raw = process.env.GOOGLE_PRIVATE_KEY || "";
  const privateKey = raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

// GET: fetch invite list for an event
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: event.googleSheetId,
      range: `${event.sheetTabName}!A:C`,
    });
    const rows = res.data.values || [];
    // Return all rows including header
    return NextResponse.json({ invites: rows });
  } catch (error) {
    console.error("Fetch invites error:", error);
    return NextResponse.json({ error: "Failed to fetch invites." }, { status: 500 });
  }
}

// POST: add invites (single or batch)
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug, emails } = await req.json();
  // emails is an array of { email, name?, organization? }

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const existingEmails = await getInviteList(event.googleSheetId, event.sheetTabName);
    const newRows: string[][] = [];
    const duplicates: string[] = [];

    for (const entry of emails) {
      const emailLower = entry.email.toLowerCase().trim();
      if (existingEmails.includes(emailLower)) {
        duplicates.push(emailLower);
      } else {
        newRows.push([emailLower, entry.name || "", entry.organization || ""]);
        existingEmails.push(emailLower); // prevent duplicates within batch
      }
    }

    if (newRows.length > 0) {
      const sheets = getSheets();
      await sheets.spreadsheets.values.append({
        spreadsheetId: event.googleSheetId,
        range: `${event.sheetTabName}!A:C`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: newRows },
      });
    }

    return NextResponse.json({
      added: newRows.length,
      duplicates: duplicates.length,
      duplicateEmails: duplicates,
    });
  } catch (error) {
    console.error("Add invites error:", error);
    return NextResponse.json({ error: "Failed to add invites." }, { status: 500 });
  }
}

// DELETE: remove an invite
export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug, email } = await req.json();

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: event.googleSheetId,
      range: `${event.sheetTabName}!A:C`,
    });
    const rows = res.data.values || [];
    const emailLower = email.toLowerCase().trim();
    const rowIndex = rows.findIndex(
      (row, i) => i > 0 && (row[0] || "").toLowerCase().trim() === emailLower
    );

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    // Get sheet ID for the tab
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: event.googleSheetId,
    });
    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === event.sheetTabName
    );
    if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
      return NextResponse.json({ error: "Sheet tab not found." }, { status: 500 });
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: event.googleSheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("Remove invite error:", error);
    return NextResponse.json({ error: "Failed to remove invite." }, { status: 500 });
  }
}
