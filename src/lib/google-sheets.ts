import { google } from "googleapis";

function getCredentials() {
  const raw = process.env.GOOGLE_CREDENTIALS;
  if (raw) {
    return JSON.parse(raw);
  }
  // Fallback to individual env vars
  const key = process.env.GOOGLE_PRIVATE_KEY || "";
  return {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: key.includes("\\n") ? key.replace(/\\n/g, "\n") : key,
  };
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: getCredentials(),
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
  // Skip header row, lowercase all emails, filter empty
  return rows.slice(1).map((row) => (row[0] || "").toLowerCase().trim()).filter(Boolean);
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

export async function getInviteRow(
  sheetId: string,
  tabName: string,
  email: string
): Promise<string[] | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A:J`,
  });
  const rows = res.data.values || [];
  const emailLower = email.toLowerCase().trim();
  const match = rows.slice(1).find((row) => (row[0] || "").toLowerCase().trim() === emailLower);
  return match || null;
}

export async function getInviteCount(
  sheetId: string,
  tabName: string
): Promise<number> {
  const list = await getInviteList(sheetId, tabName);
  return list.length;
}
