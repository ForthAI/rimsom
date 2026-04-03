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
