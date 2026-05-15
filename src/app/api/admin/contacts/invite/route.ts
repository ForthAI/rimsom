import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import { listContacts } from "@/lib/contacts";
import { getEventBySlugAnyStatus } from "@/config/events";
import { getInviteList, getSheets } from "@/lib/google-sheets";
import { appendLog } from "@/lib/log";

/**
 * Push selected contacts onto an event's Invites tab.
 *
 * Body: `{ eventSlug: string, rowIndices: number[] }`
 *  - eventSlug: must resolve to an event with `active: true`. Inviting to
 *    past events is rejected — they're archived.
 *  - rowIndices: 1-based sheet rows from the contacts master list.
 *
 * Side effects per successful invite:
 *  - new row appended to the event's `Invites` tab (status = "Not Sent")
 *  - schedulerEmail (if any) goes into the CC column
 *  - a conversation log entry "Invited to {Event Name}" appended for that
 *    contact, which makes the contact's "last contacted" auto-update.
 *
 * Dedup: contacts whose email already exists in the invite list are
 * skipped. The response reports how many of each.
 */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { eventSlug, rowIndices } = await req.json();

    if (!eventSlug || typeof eventSlug !== "string") {
      return NextResponse.json({ error: "eventSlug is required." }, { status: 400 });
    }
    if (!Array.isArray(rowIndices) || rowIndices.length === 0) {
      return NextResponse.json({ error: "Select at least one contact." }, { status: 400 });
    }

    const event = getEventBySlugAnyStatus(eventSlug);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }
    if (!event.active) {
      return NextResponse.json(
        { error: "Cannot invite to a past event. Mark it active first." },
        { status: 400 }
      );
    }

    const wantedSet = new Set<number>(
      rowIndices.map((r: unknown) => (typeof r === "number" ? r : parseInt(String(r), 10)))
    );

    const allContacts = await listContacts();
    const selected = allContacts.filter((c) => wantedSet.has(c.rowIndex));
    if (selected.length === 0) {
      return NextResponse.json({ error: "No matching contacts found." }, { status: 400 });
    }

    // Build a set of emails already invited to this event so we dedup.
    const existingEmails = new Set(
      (await getInviteList(event.googleSheetId, event.sheetTabName)).map((e) =>
        e.toLowerCase().trim()
      )
    );

    // Mirror the column order the existing invites API uses
    // (src/app/api/events/invites/route.ts POST):
    // [email, first, surname, title, organization, cc, guests, status, dateSent, vip]
    const newRows: string[][] = [];
    const invitedEmails: string[] = [];
    const skipped: string[] = [];

    for (const c of selected) {
      const email = c.email.toLowerCase().trim();
      if (existingEmails.has(email)) {
        skipped.push(email);
        continue;
      }
      // Include scheduler in CC if we have one (name + email together when both).
      const cc = c.schedulerEmail
        ? c.schedulerName
          ? `${c.schedulerName} <${c.schedulerEmail}>`
          : c.schedulerEmail
        : "";
      newRows.push([
        email,
        c.firstName,
        c.surname,
        c.title,
        c.organization,
        cc,
        "", // guests
        "Not Sent",
        "", // dateSent
        "", // vip
      ]);
      existingEmails.add(email);
      invitedEmails.push(email);
    }

    if (newRows.length > 0) {
      const sheets = getSheets();
      await sheets.spreadsheets.values.append({
        spreadsheetId: event.googleSheetId,
        range: `${event.sheetTabName}!A:J`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: newRows },
      });

      // Add a conversation log entry per newly-invited contact.
      // Done sequentially because each append reads-then-writes.
      // If any one fails, we don't fail the whole request — the invite
      // already landed in the event sheet; the log is best-effort.
      for (const email of invitedEmails) {
        try {
          await appendLog(email, `Invited to ${event.name}`);
        } catch (logErr) {
          console.error("Auto-log entry failed for", email, logErr);
        }
      }
    }

    return NextResponse.json({
      invited: invitedEmails.length,
      skipped: skipped.length,
      skippedEmails: skipped,
      eventName: event.name,
    });
  } catch (error) {
    console.error("Invite-from-contacts error:", error);
    return NextResponse.json({ error: "Failed to invite contacts." }, { status: 500 });
  }
}
