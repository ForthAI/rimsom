import { google } from "googleapis";

function getPrivateKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY || "";
  // Handle both escaped \\n and literal \n
  if (raw.includes("\\n")) {
    return raw.replace(/\\n/g, "\n");
  }
  return raw;
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: getPrivateKey(),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

export async function getInviteList(
  sheetId: string,
  tabName: string
): Promise<string[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A:A`,
  });
  const rows = res.data.values || [];
  // Skip header row, lowercase all emails
  return rows.slice(1).map((row) => (row[0] || "").toLowerCase().trim());
}

export async function checkDuplicate(
  sheetId: string,
  tabName: string,
  email: string
): Promise<boolean> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A:A`,
  });
  const rows = res.data.values || [];
  const emails = rows.slice(1).map((row) => (row[0] || "").toLowerCase().trim());
  return emails.includes(email.toLowerCase().trim());
}

export async function appendRsvp(
  sheetId: string,
  tabName: string,
  row: string[]
): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!A:A`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}

export async function getAllRsvps(
  sheetId: string,
  tabName: string
): Promise<string[][]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A:Z`,
  });
  return res.data.values || [];
}

export async function getInviteCount(
  sheetId: string,
  tabName: string
): Promise<number> {
  const list = await getInviteList(sheetId, tabName);
  return list.length;
}
