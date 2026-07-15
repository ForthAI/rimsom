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
  /**
   * Short one-line hook shown next to a collapse/expand arrow on the card.
   * If omitted, the whole bio section is hidden.
   */
  bioTeaser?: string;
  /**
   * Full bio revealed when the teaser row is expanded. Paragraph breaks
   * are `\n\n` (double newline).
   */
  bio?: string;
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
    bioTeaser: "Where policy, finance, and international commerce intersect",
    bio: `Ufo Eric-Atuanya is a global business development executive and international trade strategist with more than 30 years of experience advancing U.S. commercial engagement and market-based finance across emerging markets. His career bridges public service and private-sector leadership, with a consistent focus on mobilizing capital, expanding U.S. exports, and building sustainable market ecosystems.

Mr. Eric-Atuanya currently serves as Chief Executive Officer of Rimsom Global, where he structures bankable projects and mobilizes financing for energy, infrastructure, technology, and critical-industry clients in advance of engagement with institutional and commercial lenders. He is also Global Head of Business Development and Executive Advisor to the CEO of the Pernix Group, where he is expanding U.S. Engineering, Procurement, and Construction (EPC)–plus–Finance capabilities across Africa, the Caribbean, and Latin America. He is Founder and Chairman of the Africa Alliance for Artificial Intelligence, an initiative advancing equitable participation in emerging digital and critical-minerals value chains.

Previously, Mr. Eric-Atuanya served as Senior Vice President for Global Business Development and Senior Advisor on Africa at the Export-Import Bank of the United States (EXIM). In this role, he led initiatives across energy, critical minerals, infrastructure, and digital technologies, and helped drive a record expansion of EXIM's Sub-Saharan Africa portfolio, including a historic $2.1 billion financing commitment for solar energy systems and mini-grids in Angola. He also oversaw and coordinated the Sub-Saharan Africa Advisory Committee (SAAC) and represented EXIM in U.S. government interagency processes and international energy and economic dialogues with global partners.

Earlier in his career, Mr. Eric-Atuanya served as Trade Counsel to the Chairman of the U.S. House Committee on Ways and Means, where he helped shape U.S. trade policy and played an instrumental role in the bipartisan passage of key legislation, most notably the African Growth and Opportunity Act (AGOA). He also served as Senior Trade Policy Advisor to the U.S. Secretary of Commerce, advising on U.S. trade policy toward Africa, the Middle East, and the Caribbean.

His private-sector advisory experience includes founding Rimsom Associates, serving as Senior Advisor to the Nigerian National Petroleum Corporation (NNPC), and leading capacity-building and entrepreneurship initiatives across Africa.

Mr. Eric-Atuanya is admitted to practice law in the State of New York and holds a Juris Doctor from the American University Washington College of Law and a Bachelor of Science in Political Science and Economics from Weber State University. He serves on the board of Papyrus International and as Senior Advisor to the Institutional Investors Network.`,
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
