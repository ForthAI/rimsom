import { notFound } from "next/navigation";
import { getEventBySlug, getAllActiveEvents } from "@/config/events";
import EventHero from "@/components/events/EventHero";
import RsvpForm from "@/components/events/RsvpForm";

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

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <EventHero event={event} />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Left — event details */}
            <div>
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Event Details
              </p>
              <h2 className="font-sans text-2xl md:text-[30px] font-bold leading-[1.15] text-brand-dark mb-6">
                {event.name}
              </h2>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-8">
                {event.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div>
                    <p className="font-sans text-[14px] font-medium text-brand-dark">{event.date}</p>
                    <p className="font-sans text-[14px] text-brand-gray">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="font-sans text-[14px] font-medium text-brand-dark">{event.venueName}</p>
                  </div>
                </div>
              </div>
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
