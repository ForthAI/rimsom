import { NextRequest, NextResponse } from "next/server";
import { getEventBySlugAnyStatus } from "@/config/events";
import { getSheets } from "@/lib/google-sheets";
import { checkAuth } from "@/lib/admin-auth";

const ASSETS_TAB = "Assets";

// GET: fetch all assets for an event
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

  const event = getEventBySlugAnyStatus(slug);
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
        values: [[item, type || "", quantity || "", status || "To Do", owner || "", dueDate || "", notes || ""]],
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

  const event = getEventBySlugAnyStatus(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  // Map field name to column letter
  const fieldMap: Record<string, string> = {
    item: "A",
    type: "B",
    quantity: "C",
    status: "D",
    owner: "E",
    dueDate: "F",
    notes: "G",
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

  const event = getEventBySlugAnyStatus(slug);
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
