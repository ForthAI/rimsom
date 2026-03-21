"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    image: "/home-hero.jpg",
    label: "Advisory",
    headline: (
      <>
        What&apos;s your next
        <br />
        <span className="ml-12 md:ml-20 text-brand-gold-light">
          focused move?
        </span>
      </>
    ),
    description:
      "Rimsom Global operates where trust, timing, and access shape what happens next — bringing people, capital, and ideas together to create outcomes that endure.",
    cta: { label: "Explore Advisory", href: "/advisory" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    label: "Capital Mobilization",
    headline: (
      <>
        Structuring opportunity
        <br />
        <span className="ml-12 md:ml-20 text-brand-gold-light">
          across markets.
        </span>
      </>
    ),
    description:
      "We mobilize financing for energy, infrastructure, and critical industries — connecting projects with the capital they need to move from ambition to execution.",
    cta: { label: "Our Services", href: "/advisory" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80",
    label: "Policy & Development",
    headline: (
      <>
        Decades of influence.
        <br />
        <span className="ml-12 md:ml-20 text-brand-gold-light">
          Enduring impact.
        </span>
      </>
    ),
    description:
      "Drawing on 30+ years in trade policy and international diplomacy, we advise governments and institutions navigating complexity with clarity and conviction.",
    cta: { label: "About the Firm", href: "/about" },
  },
];

const INTERVAL = 6000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images — stacked with crossfade */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out"
          style={{
            backgroundImage: `url('${slide.image}')`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/60 to-transparent" />

      {/* Slide content */}
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 pb-24 md:pb-32 pt-32 w-full">
        <div className="max-w-3xl">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ease-out ${
                i === current
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 absolute pointer-events-none"
              }`}
            >
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold-light mb-6">
                {slide.label}
              </p>

              <h1 className="font-sans text-4xl sm:text-5xl md:text-[64px] font-bold leading-[1.05] tracking-wide text-white mb-8">
                {slide.headline}
              </h1>

              <p className="font-sans text-[15px] md:text-[17px] text-white/60 max-w-lg leading-relaxed mb-10">
                {slide.description}
              </p>

              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-4"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold/20 border border-brand-gold/30 group-hover:bg-brand-gold/40 transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-brand-gold-light transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
                <span className="text-[13px] font-sans font-semibold text-white/70 group-hover:text-white transition-colors">
                  {slide.cta.label}
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex items-center gap-3 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative h-[3px] transition-all duration-500 overflow-hidden"
              style={{ width: i === current ? 48 : 24 }}
            >
              <span className="absolute inset-0 bg-white/25 rounded-full" />
              {i === current && (
                <span
                  className="absolute inset-0 bg-brand-gold rounded-full"
                  style={{
                    animation: `progressBar ${INTERVAL}ms linear`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent z-10" />
    </section>
  );
}
