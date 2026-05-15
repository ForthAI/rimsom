import { Contact } from "@/types/contacts";
import { LogEntry } from "@/types/log";

/**
 * Build a follow-up email template based on the contact and (optionally)
 * the most recent log entry — which usually contains the "where we met"
 * context the intern wrote down on intake.
 *
 * Returns subject + body suitable for a `mailto:` URL. The user opens the
 * draft in their email client; nothing is sent automatically.
 */
export function buildFollowUpEmail(
  contact: Contact,
  latestLogNote?: string
): { subject: string; body: string } {
  const firstName = contact.firstName.trim() || "there";
  const context = (latestLogNote || "").trim();

  // Best-effort extraction: if the note mentions a place / event keyword,
  // pull it into the subject. Otherwise fall back to a generic line.
  const subject = context
    ? `Following up — ${shortenContext(context)}`
    : "Following up";

  const meetingLine = context
    ? `It was a pleasure meeting you${formatContext(context)}.`
    : "It was a pleasure meeting you recently.";

  const body = [
    `Hi ${firstName},`,
    "",
    meetingLine,
    "",
    "[A sentence about what stood out from our conversation, or a relevant next step.]",
    "",
    "I'd love to stay in touch as we continue to develop work in this space. If helpful, let me know when you might be in Washington or have time for a follow-up call.",
    "",
    "Best,",
    "[Your name]",
    "Rimsom Global",
  ].join("\n");

  return { subject, body };
}

/** Find the contact's most recent log entry by createdAt. */
export function pickLatestLogForContact(
  email: string,
  allLogs: LogEntry[]
): LogEntry | null {
  const target = email.toLowerCase().trim();
  const mine = allLogs.filter((e) => e.email === target);
  if (mine.length === 0) return null;
  mine.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return mine[0];
}

/** Build a `mailto:` URL with subject + body pre-filled. */
export function buildMailtoUrl(
  toEmail: string,
  subject: string,
  body: string,
  cc?: string
): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  if (cc) params.set("cc", cc);
  // URLSearchParams encodes spaces as "+", which mail clients tolerate but
  // some don't. Convert to %20 for body/subject reliability.
  const qs = params.toString().replace(/\+/g, "%20");
  return `mailto:${encodeURIComponent(toEmail)}?${qs}`;
}

/** Build a LinkedIn people-search URL for this contact. */
export function buildLinkedInUrl(contact: Contact): string {
  if (contact.linkedin) {
    // If it looks like a full URL, use as-is. Otherwise prepend the host.
    return contact.linkedin.startsWith("http")
      ? contact.linkedin
      : `https://${contact.linkedin.replace(/^\/+/, "")}`;
  }
  const name = [contact.firstName, contact.surname].filter(Boolean).join(" ");
  const q = [name, contact.organization].filter(Boolean).join(" ");
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}`;
}

// ---- helpers ----------------------------------------------------------------

function shortenContext(note: string): string {
  // Take only the first line / sentence-ish, cap at 60 chars.
  const firstLine = note.split(/[\n\r.]/)[0].trim();
  if (firstLine.length <= 60) return firstLine;
  return firstLine.slice(0, 57).trim() + "…";
}

function formatContext(note: string): string {
  // The note typically reads like "Met at AAAI conference" or
  // "AAAI Steering Committee, May 14". Try to format gracefully:
  // - If starts with "Met at " → strip and yield " at <rest>"
  // - Otherwise just " at <shortened>"
  const short = shortenContext(note);
  const lc = short.toLowerCase();
  if (lc.startsWith("met at ")) return " at " + short.slice(7);
  if (lc.startsWith("at ")) return " " + short;
  return " at " + short;
}
