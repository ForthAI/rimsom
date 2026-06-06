import Anthropic from "@anthropic-ai/sdk";
import { ContactInput } from "./contacts";

/**
 * Extracts structured contact data from a business-card image using
 * Claude's vision API. Returns a ContactInput shaped to drop straight
 * into the existing contacts pipeline.
 *
 * The model is instructed to leave fields blank rather than guess —
 * partial data is fine, the intern reviews everything before saving.
 */
export async function extractContactFromCard(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"
): Promise<ContactInput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it in Vercel project settings."
    );
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: PROMPT,
          },
        ],
      },
    ],
  });

  // Find the first text block in the response and parse JSON out of it.
  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Vision model returned no text.");
  }
  const raw = textBlock.text.trim();

  // The model is instructed to return JSON only, but be defensive about
  // wrapping ```json fences or trailing prose.
  const json = extractJson(raw);

  // Coerce to the ContactInput shape with safe defaults.
  return {
    email: str(json.email).toLowerCase(),
    honorific: str(json.honorific),
    firstName: str(json.firstName),
    surname: str(json.surname),
    title: str(json.title),
    organization: str(json.organization),
    notes: str(json.notes),
    lastContacted: "",
    phoneCountry: str(json.phoneCountry).replace(/^\+/, ""),
    phone: str(json.phone),
    officePhoneCountry: str(json.officePhoneCountry).replace(/^\+/, ""),
    officePhone: str(json.officePhone),
    whatsapp: str(json.whatsapp),
    linkedin: str(json.linkedin),
    website: str(json.website),
    addressLine1: str(json.addressLine1),
    addressLine2: str(json.addressLine2),
    city: str(json.city),
    state: str(json.state),
    postalCode: str(json.postalCode),
    country: str(json.country),
    secondaryEmail: str(json.secondaryEmail).toLowerCase(),
    schedulerName: "",
    schedulerEmail: "",
    additionalEmails: str(json.additionalEmails).toLowerCase(),
    status: "New",
    cardPhoto: "",
  };
}

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function extractJson(raw: string): Record<string, unknown> {
  // Strip ```json … ``` fences if present.
  const fenced = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  const body = fenced ? fenced[1] : raw;
  // First object in the text.
  const objStart = body.indexOf("{");
  const objEnd = body.lastIndexOf("}");
  if (objStart < 0 || objEnd < 0) {
    throw new Error("Vision model did not return JSON.");
  }
  const jsonText = body.slice(objStart, objEnd + 1);
  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error("Vision model returned malformed JSON.");
  }
}

const PROMPT = `You are extracting contact information from a photo of a business card.

Return ONLY a JSON object (no prose, no markdown fences). Keys you may use:
- email: primary email (lowercase)
- secondaryEmail: a second personal email if present (lowercase)
- additionalEmails: any further emails, comma-separated (lowercase)
- honorific: one of "Mr.", "Ms.", "Mx.", "Dr.", "Hon.", "The Honorable", "Excellency", "Amb.", "Prof.", "Prince" — only if the card actually shows one. Otherwise empty string.
- firstName, surname: split the name. If the card shows full name only, do your best.
- title: job title verbatim
- organization: company / org name verbatim
- phoneCountry: country-code digits only (no +) for the MOBILE number, e.g. "1" for US, "44" for UK, "212" for Morocco. Infer from country if not explicit.
- phone: the MOBILE / CELL number, in human-readable formatting (dashes, dots, spaces ok). Cards label this as "M", "Mobile", "Cell", "Cell:", or "Mobile:". If the card only shows one phone number, put it here.
- officePhoneCountry: country code digits (no +) for the OFFICE / DIRECT / LANDLINE number. Often the same as phoneCountry; if so, repeat it here.
- officePhone: the OFFICE number. Cards label this as "T", "Tel", "Office", "Office:", "Direct", "Direct Dial", "D:", or "O:". Leave empty if the card only shows one phone.
- whatsapp: only if the card EXPLICITLY labels a WhatsApp number (e.g. "WhatsApp" or the green logo). Do NOT use this slot for a mobile that wasn't explicitly tagged as WhatsApp.
- linkedin: full LinkedIn profile URL or handle (whatever's on the card)
- website: company / personal website URL
- addressLine1, addressLine2: street address; line 2 for apt/suite/floor
- city, state, postalCode, country: address components
- notes: any other notable info on the card (e.g., tagline, "Member of X", certifications) — kept brief

Rules:
- Leave a field as an empty string ("") if not present on the card. Do NOT guess or fabricate.
- If something is ambiguous (e.g., name in non-Latin script, hard to read), leave it blank.
- Preserve the language as printed (don't translate).
- Strip parentheses around country codes; e.g. "+1 (202) 555-1212" -> phoneCountry "1", phone "(202) 555-1212".

Capitalization normalization (very important for data consistency):
- Names (firstName, surname): Title Case. Preserve diacritics (Mirošič stays Mirošič). Honor surnames with internal capitalization: McDonald, MacArthur, von Habsburg, de la Cruz.
- Title: Title Case for ordinary words; preserve real acronyms (CEO, VP, COO, CTO, SVP, EVP, MD).
- Organization: Title Case for ordinary words; preserve real acronyms (NATO, IMF, UN, IFC, AfDB, DFC, USAID, etc.). E.g., "EMBASSY OF SLOVENIA" (visual all-caps for branding) -> "Embassy of Slovenia". But "IMF" stays "IMF".
- Lowercase articles inside Title Case strings: of, the, and, for, in, on, at, to, a, an. E.g., "Director of the Office" not "Director Of The Office".
- City, state, country: Title Case for full names ("Washington"); preserve two-letter postal codes uppercase ("DC", "NY"); preserve country codes ("USA", "UK").
- Emails: lowercase entirely.
- Phones: leave the digits / formatting as-is; don't reformat.

The goal is consistent, scan-friendly data in our database — not faithful reproduction of the card's typography.

Return the JSON object now.`;
