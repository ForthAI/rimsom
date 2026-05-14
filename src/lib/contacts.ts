import { getSheets } from "@/lib/google-sheets";
import { Contact } from "@/types/contacts";

/**
 * Sheet ID for the Rimsom Master Contacts spreadsheet.
 * Default points to the production sheet; override via `CONTACTS_SHEET_ID`
 * env var if you need a staging or dev copy.
 */
export const CONTACTS_SHEET_ID =
  process.env.CONTACTS_SHEET_ID || "10RTmSfiwJazaoUH81Q8GVMIVbDXFRh0a0y0k3PylO4s";

export const CONTACTS_TAB = "Contacts";

/**
 * Header order — must match the sheet's row 1 exactly.
 * If the sheet's columns are reordered, this array (and column-indexed reads)
 * must be updated together.
 */
export const CONTACT_HEADERS = [
  "email",
  "honorific",
  "firstName",
  "surname",
  "title",
  "organization",
  "ccOf",
  "notes",
  "lastContacted",
  "phone",
  "address",
  "website",
] as const;

const COL_RANGE = "A2:L"; // skip header

/**
 * Read all contact rows from the master sheet. Returns rows in sheet order
 * (which may not be alphabetical). Empty-email rows are skipped. The
 * returned `rowIndex` is 1-based and reflects the sheet, so row 2 is the
 * first data row.
 */
export async function listContacts(): Promise<Contact[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${CONTACTS_TAB}!${COL_RANGE}`,
  });
  const rows = res.data.values || [];
  const contacts: Contact[] = [];
  rows.forEach((row, i) => {
    const email = (row[0] || "").toLowerCase().trim();
    if (!email) return;
    contacts.push({
      rowIndex: i + 2, // sheet row (1-based, plus header)
      email,
      honorific: (row[1] || "").trim(),
      firstName: (row[2] || "").trim(),
      surname: (row[3] || "").trim(),
      title: (row[4] || "").trim(),
      organization: (row[5] || "").trim(),
      ccOf: (row[6] || "").trim(),
      notes: (row[7] || "").trim(),
      lastContacted: (row[8] || "").trim(),
      phone: (row[9] || "").trim(),
      address: (row[10] || "").trim(),
      website: (row[11] || "").trim(),
    });
  });
  return contacts;
}
