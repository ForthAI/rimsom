import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug } from "@/config/events";
import { getInviteList, checkDuplicate, getAllRsvps } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  try {
    const { eventSlug, email } = await req.json();

    if (!eventSlug || !email) {
      return NextResponse.json(
        { valid: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const event = getEventBySlug(eventSlug);
    if (!event) {
      return NextResponse.json(
        { valid: false, message: "Event not found." },
        { status: 404 }
      );
    }

    const inviteList = await getInviteList(event.googleSheetId, event.sheetTabName);
    const emailLower = email.toLowerCase().trim();

    if (!inviteList.includes(emailLower)) {
      return NextResponse.json({
        valid: false,
        message: "We weren't able to find that email. Please make sure you're using the email address your invitation was sent to.",
      });
    }

    const alreadyRsvpd = await checkDuplicate(
      event.googleSheetId,
      event.rsvpTabName,
      emailLower
    );

    if (alreadyRsvpd) {
      // Get attending status
      const rsvps = await getAllRsvps(event.googleSheetId, event.rsvpTabName);
      const headers = rsvps[0] || [];
      const attendingIdx = headers.indexOf("Attending");
      const matchingRow = rsvps.slice(1).find(
        (row) => (row[0] || "").toLowerCase().trim() === emailLower
      );
      const attending = attendingIdx >= 0 && matchingRow ? matchingRow[attendingIdx] : "Yes";

      return NextResponse.json({
        valid: false,
        alreadyRegistered: true,
        attending,
        message: `You have already RSVP'd for this event.`,
      });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Validate error:", error);
    return NextResponse.json(
      { valid: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
