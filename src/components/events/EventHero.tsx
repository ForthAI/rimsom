import { EventConfig } from "@/types/events";
import Image from "next/image";

export default function EventHero({ event }: { event: EventConfig }) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 text-white overflow-hidden">
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
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6 animate-fade-up">
            {event.tagline}
          </p>
          <h1 className="font-sans text-3xl md:text-[48px] font-bold leading-[1.08] animate-fade-up-delay-1 mb-4">
            {event.headline}
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/70 font-light animate-fade-up-delay-2">
            {event.subhead}
          </p>
          <div className="mt-8 flex items-center gap-6 text-[14px] text-white/50 animate-fade-up-delay-2">
            <span>{event.date}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{event.time}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
