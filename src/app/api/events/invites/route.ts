import { NextRequest, NextResponse } from "next/server";
import { getEventBySlugAnyStatus } from "@/config/events";
import { getInviteList, getSheets } from "@/lib/google-sheets";
import { checkAuth } from "@/lib/admin-auth";

// GET: fetch invite list for an event (now includes Status column D)
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const event = getEventBySlugAnyStatus(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: event.googleSheetId,
      range: `${event.sheetTabName}!A:J`,
    });
    const rows = res.data.values || [];
    // Keep header + rows with non-empty email
    const header = rows[0] || [];
    const dataRows = rows.slice(1).filter((row) => (row[0] || "").trim() !== "");
    return NextResponse.json({ invites: [header, ...dataRows.reverse()] });
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

  const event = getEventBySlugAnyStatus(slug);
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
        newRows.push([emailLower, entry.first || "", entry.surname || "", entry.title || "", entry.organization || "", entry.cc || "", entry.guests || "", "Not Sent", "", ""]);
        existingEmails.push(emailLower);
      }
    }

    if (newRows.length > 0) {
      const sheets = getSheets();
      await sheets.spreadsheets.values.append({
        spreadsheetId: event.googleSheetId,
        range: `${event.sheetTabName}!A:J`,
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

// PATCH: update invite status
export async function PATCH(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug, email, status, vip, field, value } = await req.json();

  const event = getEventBySlugAnyStatus(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: event.googleSheetId,
      range: `${event.sheetTabName}!A:J`,
    });
    const rows = res.data.values || [];
    const emailLower = email.toLowerCase().trim();
    const rowIndex = rows.findIndex(
      (row, i) => i > 0 && (row[0] || "").toLowerCase().trim() === emailLower
    );

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    // Update individual field (cc=D, guests=E)
    if (field) {
      const colMap: Record<string, string> = { email: "A", first: "B", surname: "C", title: "D", organization: "E", cc: "F", guests: "G" };
      const col = colMap[field];
      if (!col) {
        return NextResponse.json({ error: "Invalid field." }, { status: 400 });
      }
      await sheets.spreadsheets.values.update({
        spreadsheetId: event.googleSheetId,
        range: `${event.sheetTabName}!${col}${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[value || ""]] },
      });
      return NextResponse.json({ updated: true });
    }

    // Update VIP (column J)
    if (vip !== undefined) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: event.googleSheetId,
        range: `${event.sheetTabName}!J${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[vip ? "Yes" : ""]] },
      });
      return NextResponse.json({ updated: true });
    }

    // Auto-populate Date Sent when status changes to "Sent"
    const dateSent = status === "Sent"
      ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
      : "";

    await sheets.spreadsheets.values.update({
      spreadsheetId: event.googleSheetId,
      range: `${event.sheetTabName}!H${rowIndex + 1}:I${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[status, dateSent]] },
    });

    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Update invite status error:", error);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}

// DELETE: remove an invite
export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug, email } = await req.json();

  const event = getEventBySlugAnyStatus(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  try {
    const sheets = getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: event.googleSheetId,
      range: `${event.sheetTabName}!A:J`,
    });
    const rows = res.data.values || [];
    const emailLower = email.toLowerCase().trim();
    const rowIndex = rows.findIndex(
      (row, i) => i > 0 && (row[0] || "").toLowerCase().trim() === emailLower
    );

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

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
