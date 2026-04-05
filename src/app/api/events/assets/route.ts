import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getEventBySlug } from "@/config/events";
import { google } from "googleapis";

const ADMIN_COOKIE = "rimsom_admin_token";
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || "changeme";
const ASSETS_TAB = "Assets";

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
  const creds = process.env.GOOGLE_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
    : {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      };
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

// GET: fetch all assets for an event
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
      range: `${ASSETS_TAB}!A:G`,
    });
    const rows = res.data.values || [];
    return NextResponse.json({ assets: rows });
  } catch (error) {
    console.error("Fetch assets error:", error);
    return NextResponse.json({ error: "Failed to fetch assets." }, { status: 500 });
  }
}

// POST: add a new asset
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug, item, type, status, owner, dueDate, notes, quantity } = await req.json();

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const sheets = getSheets();
    await sheets.spreadsheets.values.append({
      spreadsheetId: event.googleSheetId,
      range: `${ASSETS_TAB}!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[item, type || "", status || "To Do", owner || "", dueDate || "", notes || "", quantity || ""]],
      },
    });
    return NextResponse.json({ added: true });
  } catch (error) {
    console.error("Add asset error:", error);
    return NextResponse.json({ error: "Failed to add asset." }, { status: 500 });
  }
}

// PATCH: update an asset field
export async function PATCH(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug, rowIndex, field, value } = await req.json();

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  // Map field name to column letter
  const fieldMap: Record<string, string> = {
    item: "A",
    type: "B",
    status: "C",
    owner: "D",
    dueDate: "E",
    notes: "F",
    quantity: "G",
  };

  const col = fieldMap[field];
  if (!col) {
    return NextResponse.json({ error: "Invalid field." }, { status: 400 });
  }

  try {
    const sheets = getSheets();
    // rowIndex is 0-based from data rows (excluding header), so sheet row = rowIndex + 2
    await sheets.spreadsheets.values.update({
      spreadsheetId: event.googleSheetId,
      range: `${ASSETS_TAB}!${col}${rowIndex + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[value]] },
    });
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Update asset error:", error);
    return NextResponse.json({ error: "Failed to update asset." }, { status: 500 });
  }
}

// DELETE: remove an asset row
export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug, rowIndex } = await req.json();

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const sheets = getSheets();
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: event.googleSheetId,
    });
    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === ASSETS_TAB
    );
    if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
      return NextResponse.json({ error: "Assets sheet not found." }, { status: 500 });
    }

    // rowIndex is 0-based from data rows, so sheet row = rowIndex + 1 (0-based for API)
    const sheetRowIndex = rowIndex + 1;
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: event.googleSheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: "ROWS",
                startIndex: sheetRowIndex,
                endIndex: sheetRowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("Remove asset error:", error);
    return NextResponse.json({ error: "Failed to remove asset." }, { status: 500 });
  }
}
