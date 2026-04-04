import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug } from "@/config/events";
import { getAllRsvps } from "@/lib/google-sheets";
import { sendConfirmationEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { eventSlug, email } = await req.json();

    const event = getEventBySlug(eventSlug);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const emailLower = email.toLowerCase().trim();

    // Find the RSVP row to get the guest name
    const rsvps = await getAllRsvps(event.googleSheetId, event.rsvpTabName);
    const headers = rsvps[0] || [];
    const firstNameIdx = headers.indexOf("First Name");
    const attendingIdx = headers.indexOf("Attending");
    const matchingRow = rsvps.slice(1).find(
      (row) => (row[0] || "").toLowerCase().trim() === emailLower
    );

    if (!matchingRow) {
      return NextResponse.json({ error: "RSVP not found." }, { status: 404 });
    }

    // Only resend if they said Yes
    const attending = attendingIdx >= 0 ? matchingRow[attendingIdx] : "";
    if (attending !== "Yes") {
      return NextResponse.json({ error: "No confirmation to resend." }, { status: 400 });
    }

    const guestName = firstNameIdx >= 0 ? matchingRow[firstNameIdx] : "Guest";

    await sendConfirmationEmail({
      to: emailLower,
      guestName,
      eventName: event.name,
      date: event.date,
      time: event.time,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      subject: event.emailSubject,
      ticketPdf: event.ticketPdf,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Resend confirmation error:", error);
    return NextResponse.json({ error: "Failed to resend." }, { status: 500 });
  }
}
