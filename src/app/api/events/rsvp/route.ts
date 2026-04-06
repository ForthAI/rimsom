import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug } from "@/config/events";
import { getInviteList, checkDuplicate, appendRsvp } from "@/lib/google-sheets";
import { sendConfirmationEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { eventSlug, email, fields } = await req.json();

    if (!eventSlug || !email || !fields) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const event = getEventBySlug(eventSlug);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Re-validate invite list server-side
    const inviteList = await getInviteList(event.googleSheetId, event.sheetTabName);
    if (!inviteList.includes(emailLower)) {
      return NextResponse.json({
        success: false,
        message: "We weren't able to find that email. Please make sure you're using the email address your invitation was sent to.",
      });
    }

    // Check for duplicate RSVP
    const alreadyRsvpd = await checkDuplicate(
      event.googleSheetId,
      event.rsvpTabName,
      emailLower
    );
    if (alreadyRsvpd) {
      return NextResponse.json({
        success: false,
        message: "You have already RSVP'd for this event.",
      });
    }

    // Build row from form fields in the order they appear in the config
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const attending = fields.attending || "Yes";
    const row: string[] = [emailLower];

    for (const field of event.formFields) {
      if (field.name === "email" || field.name === "attending") continue;
      row.push(fields[field.name] || "");
    }
    row.push(attending);
    row.push(formattedDate);

    // Collect guest names (guest1, guest2, etc.)
    const guestNames: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const name = (fields[`guest${i}`] || "").trim();
      if (name) guestNames.push(name);
    }

    // Append guest count (column H) and guest names
    row.push(guestNames.length > 0 ? String(guestNames.length) : "0");
    row.push(...guestNames);

    await appendRsvp(event.googleSheetId, event.rsvpTabName, row);

    // Send confirmation email (only if attending)
    if (attending === "Yes") try {
      await sendConfirmationEmail({
        to: emailLower,
        guestName: fields.firstName || fields.fullName || "Guest",
        eventName: event.name,
        date: event.date,
        time: event.time,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        subject: event.emailSubject,
        ticketPdf: event.ticketPdf,
      });
    } catch (emailError) {
      // Log but don't fail the RSVP if email fails
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
