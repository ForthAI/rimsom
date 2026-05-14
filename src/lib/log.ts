import crypto from "crypto";
import { getSheets } from "@/lib/google-sheets";
import { CONTACTS_SHEET_ID } from "@/lib/contacts";
import { LogEntry } from "@/types/log";

export const LOG_TAB = "ConversationLog";
const ROW_RANGE = "A:D";
const DATA_RANGE = "A2:D";

export class LogNotFoundError extends Error {
  constructor(id: string) {
    super(`Log entry not found: ${id}`);
    this.name = "LogNotFoundError";
  }
}

function fromRow(row: string[], rowIndex: number): LogEntry {
  return {
    rowIndex,
    id: (row[0] || "").trim(),
    email: (row[1] || "").toLowerCase().trim(),
    createdAt: (row[2] || "").trim(),
    note: (row[3] || "").trim(),
  };
}

function newId(): string {
  return crypto.randomBytes(6).toString("hex");
}

/** Read all log entries across all contacts. Newest first by createdAt. */
export async function listAllLogs(): Promise<LogEntry[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${LOG_TAB}!${DATA_RANGE}`,
  });
  const rows = res.data.values || [];
  const entries: LogEntry[] = [];
  rows.forEach((row, i) => {
    const id = (row[0] || "").trim();
    if (!id) return;
    entries.push(fromRow(row, i + 2));
  });
  entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return entries;
}

export async function listLogsByEmail(email: string): Promise<LogEntry[]> {
  const target = email.toLowerCase().trim();
  if (!target) return [];
  const all = await listAllLogs();
  return all.filter((e) => e.email === target);
}

/** Append a new log entry. Returns the created entry. */
export async function appendLog(email: string, note: string): Promise<LogEntry> {
  const emailLc = email.toLowerCase().trim();
  if (!emailLc) throw new Error("Email is required.");
  if (!note.trim()) throw new Error("Note cannot be empty.");

  const id = newId();
  const createdAt = new Date().toISOString();
  const row = [id, emailLc, createdAt, note];

  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${LOG_TAB}!${ROW_RANGE}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
  const updatedRange = res.data.updates?.updatedRange || "";
  const match = updatedRange.match(/!A(\d+):/);
  const rowIndex = match ? parseInt(match[1], 10) : 0;

  return { id, rowIndex, email: emailLc, createdAt, note };
}

/** Update a log entry's note text. The createdAt is immutable. */
export async function updateLog(id: string, note: string): Promise<LogEntry> {
  if (!note.trim()) throw new Error("Note cannot be empty.");
  const all = await listAllLogs();
  const entry = all.find((e) => e.id === id);
  if (!entry) throw new LogNotFoundError(id);

  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: CONTACTS_SHEET_ID,
    range: `${LOG_TAB}!D${entry.rowIndex}`,
    valueInputOption: "RAW",
    requestBody: { values: [[note]] },
  });
  return { ...entry, note };
}

/** Hard-delete a log entry. */
export async function deleteLog(id: string): Promise<void> {
  const all = await listAllLogs();
  const entry = all.find((e) => e.id === id);
  if (!entry) throw new LogNotFoundError(id);

  const sheets = getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: CONTACTS_SHEET_ID });
  const tab = meta.data.sheets?.find((s) => s.properties?.title === LOG_TAB);
  const sheetId = tab?.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) {
    throw new Error("ConversationLog tab not found.");
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
              startIndex: entry.rowIndex - 1,
              endIndex: entry.rowIndex,
            },
          },
        },
      ],
    },
  });
}
