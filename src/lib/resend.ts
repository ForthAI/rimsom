import { Resend } from "resend";
import fs from "fs";
import path from "path";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "");
}

interface ConfirmationEmailParams {
  to: string;
  guestName: string;
  eventName: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  subject: string;
  ticketPdf?: string;
}

function parseEventDateTime(dateStr: string, timeStr: string): { dtStart: string; dtEnd: string } | null {
  try {
    // Parse date like "Tuesday, April 14, 2026"
    const cleaned = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, "");
    const dateParsed = new Date(cleaned);
    if (isNaN(dateParsed.getTime())) return null;

    // Parse time like "3:00 PM – 5:00 PM" or "7:30 PM – 10:30 PM"
    const timeParts = timeStr.split(/\s*[–—-]\s*/);
    if (timeParts.length < 2) return null;

    const parseTime = (t: string): { hours: number; minutes: number } | null => {
      const match = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const start = parseTime(timeParts[0]);
    const end = parseTime(timeParts[1]);
    if (!start || !end) return null;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const y = dateParsed.getFullYear();
    const m = pad(dateParsed.getMonth() + 1);
    const d = pad(dateParsed.getDate());

    // Use Eastern Time (America/New_York) — events are in Washington DC
    return {
      dtStart: `${y}${m}${d}T${pad(start.hours)}${pad(start.minutes)}00`,
      dtEnd: `${y}${m}${d}T${pad(end.hours)}${pad(end.minutes)}00`,
    };
  } catch {
    return null;
  }
}

function generateICS(params: ConfirmationEmailParams): string | null {
  const dt = parseEventDateTime(params.date, params.time);
  if (!dt) return null;

  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rimsom Global//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;TZID=America/New_York:${dt.dtStart}`,
    `DTEND;TZID=America/New_York:${dt.dtEnd}`,
    `DTSTAMP:${stamp}`,
    `UID:${Date.now()}@rimsomglobal.com`,
    `SUMMARY:${params.eventName}`,
    `LOCATION:${params.venueAddress}`,
    `DESCRIPTION:RSVP confirmed. We look forward to welcoming you.`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}


export async function sendConfirmationEmail(params: ConfirmationEmailParams) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.venueAddress)}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <tr>
      <td style="background:#162246;padding:24px 32px;">
        <img src="https://rimsomglobal.com/logo-white.svg" alt="Rimsom Global" height="36" style="display:block;" />
      </td>
    </tr>
    <tr>
      <td style="height:3px;background:#a8843a;"></td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:40px 32px 24px;">
        <p style="font-size:14px;color:#5a5a5a;margin:0 0 24px;line-height:1.6;">
          Dear ${params.guestName},
        </p>
        <p style="font-size:14px;color:#5a5a5a;margin:0 0 24px;line-height:1.6;">
          Your RSVP has been confirmed for <strong style="color:#1a1a1a;">${params.eventName}</strong>.
          We look forward to welcoming you.
        </p>
      </td>
    </tr>
    <!-- Event Details -->
    <tr>
      <td style="padding:0 32px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f5;border-left:3px solid #a8843a;padding:20px 24px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#a8843a;margin:0 0 12px;">
                Event Details
              </p>
              <p style="font-size:14px;color:#1a1a1a;margin:0 0 8px;font-weight:600;">
                ${params.eventName}
              </p>
              <p style="font-size:13px;color:#5a5a5a;margin:0 0 4px;line-height:1.5;">
                ${params.date}<br />
                ${params.time}
              </p>
              <p style="font-size:13px;color:#5a5a5a;margin:16px 0 4px;line-height:1.5;">
                <strong style="color:#1a1a1a;">${params.venueName}</strong><br />
                ${params.venueAddress}
              </p>
              <p style="margin:12px 0 0;">
                <a href="${mapsUrl}" style="font-size:12px;color:#a8843a;text-decoration:none;font-weight:600;">
                  View on Google Maps →
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding:24px 32px;border-top:1px solid #e8e8e8;">
        <p style="font-size:11px;color:#999999;margin:0;line-height:1.5;">
          Questions? Contact us at
          <a href="mailto:events@rimsomglobal.com" style="color:#a8843a;text-decoration:none;">events@rimsomglobal.com</a>
        </p>
        <p style="font-size:11px;color:#999999;margin:8px 0 0;">
          © ${new Date().getFullYear()} Rimsom Global. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const attachments: { filename: string; content: Buffer }[] = [];

  // Generate and attach calendar invite
  const icsContent = generateICS(params);
  if (icsContent) {
    attachments.push({
      filename: `${params.eventName.replace(/[^a-zA-Z0-9]/g, "-")}.ics`,
      content: Buffer.from(icsContent, "utf-8"),
    });
  }

  if (params.ticketPdf) {
    const pdfPath = path.join(process.cwd(), "public", params.ticketPdf);
    if (fs.existsSync(pdfPath)) {
      attachments.push({
        filename: `${params.eventName.replace(/[^a-zA-Z0-9]/g, "-")}-Ticket.pdf`,
        content: fs.readFileSync(pdfPath),
      });
    }
  }

  await getResend().emails.send({
    from: "Rimsom Global Events <events@rimsomglobal.com>",
    to: params.to,
    subject: params.subject,
    html,
    ...(attachments.length > 0 ? { attachments } : {}),
  });
}
