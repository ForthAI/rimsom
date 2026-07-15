import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { cards, getCardBySlug, formatPhone } from "@/data/cards";
import { CardBio } from "@/components/CardBio";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cards.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return { title: "Not found" };
  const fullName = [card.firstName, card.lastName].join(" ");
  return {
    title: `${fullName} · ${card.company}`,
    description: `${card.title}, ${card.company}`,
    // Hidden from search engines — these are private contact cards.
    robots: { index: false, follow: false },
  };
}

export default async function CardPage({ params }: PageProps) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  const fullName = [card.firstName, card.lastName].join(" ");
  const displayName = card.suffix ? `${fullName}, ${card.suffix}` : fullName;

  return (
    <div className="min-h-screen bg-brand-navy text-white flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">
        {/* Photo */}
        <div className="mx-auto mb-8 relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-2 ring-brand-gold/40 shadow-2xl">
          <Image
            src={card.photo}
            alt={displayName}
            fill
            className="object-cover object-top"
            sizes="192px"
            priority
          />
        </div>

        {/* Identity */}
        <div className="text-center mb-10">
          <h1 className="font-sans text-2xl sm:text-[28px] font-bold leading-tight">
            {fullName}
            {card.suffix && (
              <span className="text-white/60 font-normal">, {card.suffix}</span>
            )}
          </h1>
          <p className="font-sans text-[14px] text-white/70 mt-2">{card.title}</p>
          <p className="font-sans text-[11px] tracking-widest-plus uppercase text-brand-gold mt-3">
            {card.company}
          </p>
        </div>

        {/* Optional expandable bio between identity and actions. Rendered
            only if the card config provides both a teaser and a bio. */}
        {card.bioTeaser && card.bio && (
          <CardBio teaser={card.bioTeaser} bio={card.bio} />
        )}

        {/* Action: Save to Contacts (primary) */}
        <a
          href={`/api/card/${card.slug}/vcf`}
          download
          className="block w-full text-center px-6 py-4 mb-3 bg-brand-gold hover:bg-brand-gold-light transition-colors rounded-lg font-sans text-[14px] font-semibold tracking-wide text-white"
        >
          + Save to Contacts
        </a>

        {/* Contact rows */}
        <div className="space-y-2 mb-10">
          {card.mobile && (
            <ContactRow
              href={`tel:${card.mobile}`}
              label="Mobile"
              value={formatPhone(card.mobile)}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              }
            />
          )}
          {card.workPhone && (
            <ContactRow
              href={`tel:${card.workPhone}`}
              label="Work"
              value={formatPhone(card.workPhone)}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              }
            />
          )}
          <ContactRow
            href={`mailto:${card.email}`}
            label="Email"
            value={card.email}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />
        </div>

        {/* Footer */}
        {card.city && (
          <p className="text-center font-sans text-[12px] text-white/40">
            {card.city}
          </p>
        )}
      </div>
    </div>
  );
}

function ContactRow({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
    >
      <span className="text-brand-gold flex-shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[10px] font-sans font-semibold tracking-widest uppercase text-white/40">
          {label}
        </span>
        <span className="block font-sans text-[14px] text-white truncate">
          {value}
        </span>
      </span>
    </a>
  );
}
