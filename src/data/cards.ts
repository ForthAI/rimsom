/**
 * Digital business cards. Each entry powers `/card/{slug}` and the
 * vCard (`.vcf`) download at `/api/card/{slug}/vcf`. Add new team
 * members by appending to this array — no code changes needed elsewhere.
 *
 * The page at /card/{slug} is intentionally NOT under the (main) layout
 * group so it bypasses the SiteGate password — QR scans need to work
 * for anyone the cardholder hands a card to. We rely on `noindex` to
 * keep these pages out of search engines instead of password-gating them.
 */
export interface BusinessCard {
  slug: string;
  /** Path under /public, e.g. "/ufo.png". 3:4 portrait works best. */
  photo: string;
  firstName: string;
  lastName: string;
  /** e.g. "Esq.", "PhD" — shown small after the name. Optional. */
  suffix?: string;
  title: string;
  company: string;
  /** International format with leading +, e.g. "+13462185291". */
  mobile?: string;
  workPhone?: string;
  email: string;
  /** Displayed only as a footer line, e.g. "Washington, DC". Optional. */
  city?: string;
  /** Goes into the .vcf only; not displayed (you're already on the site). */
  website?: string;
}

export const cards: BusinessCard[] = [
  {
    slug: "ufo",
    photo: "/ufo.png",
    firstName: "Ufo",
    lastName: "Eric-Atuanya",
    suffix: "Esq.",
    title: "Chief Executive Officer",
    company: "Rimsom Global",
    mobile: "+13462185291",
    workPhone: "+12024389718",
    email: "ufo@rimsomglobal.com",
    city: "Washington, DC",
    website: "https://rimsomglobal.com",
  },
  {
    slug: "matthew",
    photo: "/matthew.jpg",
    firstName: "Matthew",
    lastName: "Snyder",
    title: "Senior Advisor",
    company: "Rimsom Global",
    mobile: "+12023601889",
    email: "matthew.s@rimsomglobal.com",
    city: "Washington, DC",
    website: "https://rimsomglobal.com",
  },
];

export function getCardBySlug(slug: string): BusinessCard | undefined {
  return cards.find((c) => c.slug === slug);
}

/** Pretty-print a phone number stored in E.164 format. "+13462185291" -> "+1 346 218 5291". */
export function formatPhone(p: string): string {
  if (!p) return "";
  // Very simple US-style formatter; non-US numbers just render with spaces every 3.
  const trimmed = p.replace(/[^\d+]/g, "");
  if (trimmed.startsWith("+1") && trimmed.length === 12) {
    return `+1 ${trimmed.slice(2, 5)} ${trimmed.slice(5, 8)} ${trimmed.slice(8)}`;
  }
  return trimmed;
}
