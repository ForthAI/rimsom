import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getEventBySlug } from "@/config/events";
import { getInviteList, checkDuplicate, appendRsvp, getInviteRow } from "@/lib/google-sheets";
import { sendConfirmationEmail } from "@/lib/resend";

const ADMIN_COOKIE = "rimsom_admin_token";
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || "changeme";

function validateToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  if (sig !== expected) return false;
  const timestamp = parseInt(payload.split("_")[0], 10);
  return Date.now() - timestamp < 24 * 60 * 60 * 1000;
}

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return token && validateToken(token);
}

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

    // Build greeting from invite title + surname
    let greeting = fields.firstName || fields.fullName || "Guest";
    try {
      const inviteRow = await getInviteRow(event.googleSheetId, event.sheetTabName, emailLower);
      if (inviteRow) {
        const title = (inviteRow[3] || "").trim().toLowerCase();
        const surname = (inviteRow[2] || "").trim();
        if (title.startsWith("ambassador")) {
          greeting = "Your Excellency";
        } else if (title.startsWith("congressman") && surname) {
          greeting = `Congressman ${surname}`;
        } else if (title.startsWith("congresswoman") && surname) {
          greeting = `Congresswoman ${surname}`;
        } else if (title.startsWith("senator") && surname) {
          greeting = `Senator ${surname}`;
        } else if (title.startsWith("minister") || title.startsWith("hon")) {
          greeting = "Honorable Minister";
        } else if (title.startsWith("secretary")) {
          greeting = "Honorable Secretary";
        }
      }
    } catch {
      // Fall back to first name if invite lookup fails
    }

    // Send confirmation email (only if attending)
    if (attending === "Yes") try {
      await sendConfirmationEmail({
        to: emailLower,
        guestName: greeting,
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

// PATCH: Admin manually marks a pending invite as attending
export async function PATCH(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { slug, email } = await req.json();
    const event = getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const emailLower = email.toLowerCase().trim();

    // Check not already RSVP'd
    const alreadyRsvpd = await checkDuplicate(event.googleSheetId, event.rsvpTabName, emailLower);
    if (alreadyRsvpd) {
      return NextResponse.json({ error: "Already has an RSVP entry." }, { status: 400 });
    }

    // Get invite data to populate the RSVP row
    const inviteRow = await getInviteRow(event.googleSheetId, event.sheetTabName, emailLower);
    const firstName = inviteRow ? (inviteRow[1] || "") : "";
    const surname = inviteRow ? (inviteRow[2] || "") : "";
    const title = inviteRow ? (inviteRow[3] || "") : "";
    const organization = inviteRow ? (inviteRow[4] || "") : "";

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Build row matching RSVP sheet format: Email, First Name, Surname, Title, Organization, Attending, Timestamp, Guests
    const row = [emailLower, firstName, surname, title, organization, "Yes", formattedDate, "0"];

    await appendRsvp(event.googleSheetId, event.rsvpTabName, row);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manual RSVP error:", error);
    return NextResponse.json({ error: "Failed to add RSVP." }, { status: 500 });
  }
}
