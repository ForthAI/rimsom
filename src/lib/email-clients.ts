/**
 * Supported "where to compose an email" targets. mailto: hands off to
 * the OS-default mail handler (which may not be configured at all and
 * may silently open a blank tab — that's why we offer web alternatives).
 *
 * Gmail and Outlook URLs open in a new tab and rely on the user being
 * signed in. For Gmail, if the user is signed into multiple accounts,
 * the URL targets whichever is the *primary* in this browser session;
 * they can switch with the account picker in Gmail's top-right corner,
 * or set EMAIL_GMAIL_ACCOUNT_INDEX in localStorage to target /mail/u/N/.
 */
export type EmailClient = "gmail" | "outlook" | "mailto";

export const EMAIL_CLIENT_LABELS: Record<EmailClient, string> = {
  gmail: "Gmail",
  outlook: "Outlook (web)",
  mailto: "System default",
};

export const LS_CLIENT_KEY = "rimsom_email_client";
export const LS_GMAIL_INDEX_KEY = "rimsom_gmail_account_index";

/** Build a compose URL for the chosen client. */
export function buildComposeUrl(
  client: EmailClient,
  to: string,
  subject: string,
  body: string,
  cc?: string
): string {
  if (client === "gmail") {
    // Gmail compose with optional /mail/u/N/ for multi-account users.
    const index =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(LS_GMAIL_INDEX_KEY) || "").trim()
        : "";
    const path = index ? `/mail/u/${encodeURIComponent(index)}/` : "/mail/";
    const params = new URLSearchParams();
    params.set("view", "cm");
    params.set("fs", "1");
    params.set("to", to);
    params.set("su", subject);
    params.set("body", body);
    if (cc) params.set("cc", cc);
    // Gmail handles `+` in body as space oddly; encode literal spaces.
    const qs = params.toString().replace(/\+/g, "%20");
    return `https://mail.google.com${path}?${qs}`;
  }
  if (client === "outlook") {
    const params = new URLSearchParams();
    params.set("to", to);
    params.set("subject", subject);
    params.set("body", body);
    if (cc) params.set("cc", cc);
    const qs = params.toString().replace(/\+/g, "%20");
    return `https://outlook.office.com/mail/deeplink/compose?${qs}`;
  }
  // mailto:
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  if (cc) params.set("cc", cc);
  const qs = params.toString().replace(/\+/g, "%20");
  return `mailto:${encodeURIComponent(to)}?${qs}`;
}

export function isWebClient(client: EmailClient): boolean {
  return client === "gmail" || client === "outlook";
}

/** Read the user's last-chosen client from localStorage. Falls back to gmail. */
export function getPreferredClient(): EmailClient {
  if (typeof window === "undefined") return "gmail";
  const raw = window.localStorage.getItem(LS_CLIENT_KEY);
  if (raw === "gmail" || raw === "outlook" || raw === "mailto") return raw;
  return "gmail";
}

export function setPreferredClient(client: EmailClient): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_CLIENT_KEY, client);
}
