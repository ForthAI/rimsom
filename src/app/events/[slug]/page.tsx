import { notFound } from "next/navigation";
import { getEventBySlug, getAllActiveEvents } from "@/config/events";
import EventHero from "@/components/events/EventHero";
import RsvpForm from "@/components/events/RsvpForm";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllActiveEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.name} | Rimsom Global`,
    description: event.subhead,
  };
}

// Namibia invite-style content
function NamibiaInviteContent() {
  return (
    <div className="space-y-6 font-sans text-[15px] text-brand-gray leading-relaxed">
      <div>
        <p className="text-[11px] font-semibold tracking-widest-plus uppercase text-brand-gold mb-3">
          Featuring
        </p>
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-brand-navy">Hon. Ericah Shafudah</p>
            <p className="text-[13px] text-brand-muted">Minister of Finance, Republic of Namibia</p>
          </div>
          <div>
            <p className="font-semibold text-brand-navy">Mr. Ebson Uanguta</p>
            <p className="text-[13px] text-brand-muted">Governor, Bank of Namibia</p>
          </div>
        </div>
      </div>

      <p>
        A limited group (30 attendees) of senior stakeholders across government, international financial
        institutions, and strategic investors will join this discussion.
      </p>

      <p>
        The convening will focus on Namibia&apos;s economic outlook, fiscal priorities, and near-term,
        bankable investment opportunities under National Development Program 6 (NDP-6).
      </p>

      <p>
        We would value your participation and the opportunity for direct engagement with senior
        decision-makers and investors.
      </p>

      <p>
        <strong className="text-brand-navy">Rimsom Global</strong>, a strategic advisory firm connecting capital,
        governments and private sector to emerging market investment opportunities, is pleased to invite you to this
        closed-door Namibia Economic Resilience &amp; Investment Convening on
        the margins of the World Bank–IMF Spring Meetings.
      </p>
    </div>
  );
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  // Invite-style layout (e.g., Namibia)
  if (event.inviteLayout) {
    return (
      <>
        {/* Hero header with logo and event name */}
        <div className="relative text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={event.heroImage}
              alt={event.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-brand-navy/85" />
          </div>
          <div className="relative z-10">
            <div className="max-w-content mx-auto px-6 md:px-10 py-5">
              <Image
                src="/logo-white.svg"
                alt="Rimsom Global"
                width={120}
                height={38}
                className="h-8 w-auto"
              />
            </div>
            <div className="max-w-content mx-auto px-6 md:px-10 pb-16 md:pb-20 pt-8 md:pt-12">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Official Invitation
              </p>
              <h1 className="font-sans text-3xl md:text-[48px] font-bold leading-[1.08] mb-6">
                {event.name}
              </h1>
              <div className="space-y-1 text-[14px] text-white/70">
                <p>April 14, 2026 &middot; 3:00–5:00 PM EST</p>
                <p>Downtown Washington, D.C.</p>
                <p className="text-[12px] text-white/40 italic mt-2">Exact venue details will be provided upon confirmation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invitation content + RSVP form side by side */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-content mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              {/* Left — invitation content */}
              <div>
                <NamibiaInviteContent />
              </div>

              {/* Right — RSVP form */}
              <div>
                <RsvpForm event={event} />
              </div>
            </div>
          </div>
        </section>

        {/* Minimal footer */}
        <footer className="py-8 border-t border-brand-light">
          <div className="max-w-content mx-auto px-6 md:px-10">
            <p className="font-sans text-[11px] text-brand-muted text-center">
              &copy; {new Date().getFullYear()} Rimsom Global. All rights reserved.
            </p>
          </div>
        </footer>
      </>
    );
  }

  // Default layout (e.g., Finance After Hours)
  return (
    <>
      <EventHero event={event} />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Left — RSVP form */}
            <div>
              <RsvpForm event={event} />
            </div>

            {/* Right — about the event */}
            <div>
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-6">
                About Event
              </p>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="py-8 border-t border-brand-light">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <p className="font-sans text-[11px] text-brand-muted text-center">
            &copy; {new Date().getFullYear()} Rimsom Global. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
