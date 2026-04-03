import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug } from "@/config/events";
import { getInviteList, checkDuplicate } from "@/lib/google-sheets";

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
        message: "This email is not on the invite list for this event.",
      });
    }

    const alreadyRsvpd = await checkDuplicate(
      event.googleSheetId,
      event.rsvpTabName,
      emailLower
    );

    if (alreadyRsvpd) {
      return NextResponse.json({
        valid: false,
        alreadyRegistered: true,
        message: "You have already RSVP'd for this event.",
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
