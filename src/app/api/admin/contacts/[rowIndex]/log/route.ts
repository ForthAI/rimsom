import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import { listContacts } from "@/lib/contacts";
import { appendLog, listLogsByEmail } from "@/lib/log";

async function resolveEmail(rowIndexStr: string): Promise<string | null> {
  const rowIndex = parseInt(rowIndexStr, 10);
  if (Number.isNaN(rowIndex) || rowIndex < 2) return null;
  const contacts = await listContacts();
  const c = contacts.find((c) => c.rowIndex === rowIndex);
  return c?.email || null;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ rowIndex: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { rowIndex } = await context.params;
  try {
    const email = await resolveEmail(rowIndex);
    if (!email) {
      return NextResponse.json({ error: "Contact not found." }, { status: 404 });
    }
    const entries = await listLogsByEmail(email);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Fetch log error:", error);
    return NextResponse.json({ error: "Failed to fetch log." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ rowIndex: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { rowIndex } = await context.params;
  try {
    const body = await req.json();
    const note = (body.note || "").toString().trim();
    if (!note) {
      return NextResponse.json({ error: "Note is required." }, { status: 400 });
    }
    const email = await resolveEmail(rowIndex);
    if (!email) {
      return NextResponse.json({ error: "Contact not found." }, { status: 404 });
    }
    const entry = await appendLog(email, note);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Create log error:", error);
    return NextResponse.json({ error: "Failed to add log entry." }, { status: 500 });
  }
}
