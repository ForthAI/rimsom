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
 * If columns are reordered, this array and the column-indexed reads/writes
 * (toRow / fromRow / ROW_RANGE / DATA_RANGE) must be updated together.
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
  "phoneCountry",
  "phone",
  "whatsapp",
  "linkedin",
  "website",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "postalCode",
  "country",
] as const;

/** Sheet columns A through T (20 columns). */
const ROW_RANGE = "A:T";
const DATA_RANGE = "A2:T";

export type ContactInput = Omit<Contact, "rowIndex">;

export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
    this.name = "DuplicateEmailError";
  }
}

export class ContactNotFoundError extends Error {
  constructor(rowIndex: number) {
    super(`Contact not found at row ${rowIndex}`);
    this.name = "ContactNotFoundError";
  }
}

/** Serialize a contact into the 20-column row order used in the sheet. */
function toRow(input: ContactInput): string[] {
  return [
    input.email.toLowerCase().trim(),
    input.honorific || "",
    input.firstName || "",
    input.surname || "",
    input.title || "",
    input.organization || "",
    input.ccOf || "",
    input.notes || "",
    input.lastContacted || "",
    input.phoneCountry || "",
    input.phone || "",
    input.whatsapp || "",
    input.linkedin || "",
    input.website || "",
    input.addressLine1 || "",
    input.addressLine2 || "",
    input.city || "",
    input.state || "",
    input.postalCode || "",
    input.country || "",
  ];
}

/** Build a Contact from a sheet row + its 1-based sheet row index. */
function fromRow(row: string[], rowIndex: number): Contact {
  return {
    rowIndex,
    email: (row[0] || "").toLowerCase().trim(),
    honorific: (row[1] || "").trim(),
    firstName: (row[2] || "").trim(),
    surname: (row[3] || "").trim(),
    title: (row[4] || "").trim(),
    organization: (row[5] || "").trim(),
    ccOf: (row[6] || "").trim(),
    notes: (row[7] || "").trim(),
    lastContacted: (row[8] || "").trim(),
    phoneCountry: (row[9] || "").trim(),
    phone: (row[10] || "").trim(),
    whatsapp: (row[11] || "").trim(),
    linkedin: (row[12] || "").trim(),
    website: (row[13] || "").trim(),
    addressLine1: (row[14] || "").trim(),
    addressLine2: (row[15] || "").trim(),
    city: (row[16] || "").trim(),
    state: (row[17] || "").trim(),
    postalCode: (row[18] || "").trim(),
    country: (row[19] || "").trim(),
  };
}

/**
 * Read all contact rows from the master sheet. Empty-email rows are
 * skipped. The returned `rowIndex` is 1-based and reflects the sheet, so
 * row 2 is the first data row.
 */
export async function listContacts(): Promise<Contact[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${CONTACTS_TAB}!${DATA_RANGE}`,
  });
  const rows = res.data.values || [];
  const contacts: Contact[] = [];
  rows.forEach((row, i) => {
    const email = (row[0] || "").toLowerCase().trim();
    if (!email) return;
    contacts.push(fromRow(row, i + 2));
  });
  return contacts;
}

export async function findContactByEmail(email: string): Promise<Contact | null> {
  const target = email.toLowerCase().trim();
  if (!target) return null;
  const all = await listContacts();
  return all.find((c) => c.email === target) || null;
}

/**
 * Append a new contact to the bottom of the sheet. Throws
 * `DuplicateEmailError` if the email already exists.
 */
export async function appendContact(input: ContactInput): Promise<Contact> {
  const email = input.email.toLowerCase().trim();
  if (!email) throw new Error("Email is required.");

  const existing = await findContactByEmail(email);
  if (existing) throw new DuplicateEmailError(email);

  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${CONTACTS_TAB}!${ROW_RANGE}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [toRow({ ...input, email })] },
  });

  const updatedRange = res.data.updates?.updatedRange || "";
  const match = updatedRange.match(/!A(\d+):/);
  const rowIndex = match ? parseInt(match[1], 10) : 0;

  return { ...input, email, rowIndex };
}

/**
 * Update a contact row in place. Verifies the row's current email matches
 * `priorEmail` to guard against shifted indices.
 */
export async function updateContact(
  rowIndex: number,
  priorEmail: string,
  input: ContactInput
): Promise<Contact> {
  const sheets = getSheets();
  const priorEmailLc = priorEmail.toLowerCase().trim();
  const newEmailLc = input.email.toLowerCase().trim();
  if (!newEmailLc) throw new Error("Email is required.");

  const current = await sheets.spreadsheets.values.get({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${CONTACTS_TAB}!A${rowIndex}`,
  });
  const currentEmail = ((current.data.values?.[0]?.[0] || "") as string).toLowerCase().trim();
  if (currentEmail !== priorEmailLc) {
    throw new ContactNotFoundError(rowIndex);
  }

  if (newEmailLc !== priorEmailLc) {
    const other = await findContactByEmail(newEmailLc);
    if (other && other.rowIndex !== rowIndex) {
      throw new DuplicateEmailError(newEmailLc);
    }
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${CONTACTS_TAB}!A${rowIndex}:T${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [toRow({ ...input, email: newEmailLc })] },
  });

  return { ...input, email: newEmailLc, rowIndex };
}

/** Hard-delete a contact row. Verifies email matches before deleting. */
export async function deleteContact(rowIndex: number, priorEmail: string): Promise<void> {
  const sheets = getSheets();
  const priorEmailLc = priorEmail.toLowerCase().trim();

  const current = await sheets.spreadsheets.values.get({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${CONTACTS_TAB}!A${rowIndex}`,
  });
  const currentEmail = ((current.data.values?.[0]?.[0] || "") as string).toLowerCase().trim();
  if (currentEmail !== priorEmailLc) {
    throw new ContactNotFoundError(rowIndex);
  }

  const meta = await sheets.spreadsheets.get({ spreadsheetId: CONTACTS_SHEET_ID });
  const tab = meta.data.sheets?.find((s) => s.properties?.title === CONTACTS_TAB);
  const sheetId = tab?.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) {
    throw new Error("Contacts tab not found in spreadsheet.");
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: CONTACTS_SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}
