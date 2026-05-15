import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import { appendContact, listContacts, DuplicateEmailError } from "@/lib/contacts";
import { listAllLogs } from "@/lib/log";
import { normalizeContactInput, EMAIL_RE } from "@/lib/contacts-normalize";
import { getAllActiveEvents } from "@/config/events";

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    // Fetch both in parallel — sheets API is the slow path.
    const [contacts, allLogs] = await Promise.all([listContacts(), listAllLogs()]);

    // Compute most-recent log date per email.
    const latestByEmail = new Map<string, string>();
    for (const log of allLogs) {
      const existing = latestByEmail.get(log.email);
      if (!existing || log.createdAt > existing) {
        latestByEmail.set(log.email, log.createdAt);
      }
    }

    // Augment each contact with a computed `lastContacted` derived from logs,
    // falling back to the manually-entered sheet value. The computed value is
    // the ISO date portion of the most recent log entry's createdAt.
    const augmented = contacts.map((c) => {
      const logIso = latestByEmail.get(c.email);
      const fromLog = logIso ? logIso.slice(0, 10) : "";
      const manual = c.lastContacted;
      // Prefer whichever is more recent (string compare works on YYYY-MM-DD).
      const lastContacted = !manual ? fromLog : !fromLog ? manual : fromLog > manual ? fromLog : manual;
      return { ...c, lastContacted };
    });

    // Bundle the active events list so the contacts page can populate
    // the invite-from-contacts dropdown without an extra round-trip.
    const activeEvents = getAllActiveEvents().map((e) => ({ slug: e.slug, name: e.name }));

    return NextResponse.json({
      contacts: augmented,
      activeEvents,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const input = normalizeContactInput(body);
    if (!input.email || !EMAIL_RE.test(input.email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const contact = await appendContact(input);
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json(
        { error: "A contact with this email already exists." },
        { status: 409 }
      );
    }
    console.error("Create contact error:", error);
    return NextResponse.json({ error: "Failed to create contact." }, { status: 500 });
  }
}
