import { NextResponse } from "next/server";
import { getCardBySlug } from "@/data/cards";

/**
 * Generates a vCard 3.0 file (.vcf) for download. Phones recognize the
 * MIME type `text/vcard` and import directly into Contacts.app.
 *
 * vCard 3.0 chosen over 4.0 because iOS/Android support 3.0 universally;
 * 4.0 is technically newer but less consistently handled by older phones.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const card = getCardBySlug(slug);
  if (!card) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const fullNameDisplay = [
    card.firstName,
    card.lastName,
    card.suffix ? `, ${card.suffix}` : "",
  ]
    .join(" ")
    .trim();

  // Escape vCard reserved characters per RFC 6350 §3.4.
  const esc = (v: string) =>
    v
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");

  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`FN:${esc(fullNameDisplay)}`);
  // N = structured name: Family;Given;Additional;Prefixes;Suffixes
  lines.push(
    `N:${esc(card.lastName)};${esc(card.firstName)};;;${esc(card.suffix || "")}`
  );
  lines.push(`ORG:${esc(card.company)}`);
  lines.push(`TITLE:${esc(card.title)}`);
  if (card.mobile) lines.push(`TEL;TYPE=CELL,VOICE:${card.mobile}`);
  if (card.workPhone) lines.push(`TEL;TYPE=WORK,VOICE:${card.workPhone}`);
  lines.push(`EMAIL;TYPE=WORK:${esc(card.email)}`);
  if (card.website) lines.push(`URL:${esc(card.website)}`);
  if (card.city) {
    // ADR fields: PO Box;Extended;Street;City;Region;Postal;Country
    // City-only contacts go into the City slot.
    lines.push(`ADR;TYPE=WORK:;;;${esc(card.city)};;;`);
  }
  lines.push("END:VCARD");

  const body = lines.join("\r\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${card.firstName}-${card.lastName}.vcf"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
