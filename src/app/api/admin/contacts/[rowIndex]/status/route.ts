import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import { getSheets } from "@/lib/google-sheets";
import { CONTACTS_SHEET_ID, CONTACTS_TAB } from "@/lib/contacts";
import { CONTACT_STATUSES } from "@/types/contacts";

const STATUS_SET = new Set<string>(CONTACT_STATUSES as readonly string[]);

/**
 * Lightweight endpoint for one-field status updates triggered by quick
 * actions in the UI (e.g., "Mark as Outreach Sent" after the user clicks
 * the Compose Email button). Avoids a full contact PATCH for what's
 * really just a single-cell write.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ rowIndex: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { rowIndex: rowIndexStr } = await context.params;
  const rowIndex = parseInt(rowIndexStr, 10);
  if (Number.isNaN(rowIndex) || rowIndex < 2) {
    return NextResponse.json({ error: "Invalid row index." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const status = (body.status || "").toString().trim();
    if (status !== "" && !STATUS_SET.has(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }
    // Status lives in column X (24th).
    const sheets = getSheets();
    await sheets.spreadsheets.values.update({
      spreadsheetId: CONTACTS_SHEET_ID,
      range: `${CONTACTS_TAB}!X${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: { values: [[status]] },
    });
    return NextResponse.json({ updated: true, status });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
