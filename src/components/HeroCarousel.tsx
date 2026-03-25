"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&q=80",
    label: "Global Reach",
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
      "Rimsom Global operates where trust, timing, and access shape outcomes—connecting people, capital, and ideas to deliver results that endure.",
    cta: { label: "Explore Advisory", href: "/advisory" },
  },
  {
    image: "/power-hero.jpg",
    label: "Transformative Industries",
    headline: (
      <>
        Building what
        <br />
        <span className="ml-12 md:ml-20 text-brand-gold-light">
          economies need.
        </span>
      </>
    ),
    description:
      "From energy systems to digital networks, we structure and advance the infrastructure that powers growth across emerging markets.",
    cta: { label: "Our Services", href: "/advisory" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    label: "Capital Structuring & Mobilization",
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
      "We transform projects into bankable opportunities and mobilize capital across energy, infrastructure, and critical industries—connecting vision to financing and execution.",
    cta: { label: "Learn More", href: "/advisory" },
  },
  {
    image: "/access-hero.jpg",
    label: "Strategic Access",
    headline: (
      <>
        Opening doors that
        <br />
        <span className="ml-12 md:ml-20 text-brand-gold-light">
          drive results.
        </span>
      </>
    ),
    description:
      "Leveraging 30+ years in trade policy and diplomacy, we connect clients to governments, institutions, and decision makers worldwide.",
    cta: { label: "About the Firm", href: "/about" },
  },
];

const INTERVAL = 6000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const isPausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgressKey((k) => k + 1);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrent((prev) => (prev + 1) % slides.length);
        setProgressKey((k) => k + 1);
      }
    }, INTERVAL);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleDotClick = (index: number) => {
    goTo(index);
    startTimer();
  };

  return (
    <section
      className="relative h-screen flex flex-col overflow-hidden"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
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

      {/* Bottom-only gradient — keeps top vibrant, darkens where text sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Main layout: pushes content to bottom */}
      <div className="relative z-10 flex-1" />

      {/* Slide content area — fixed height so nav never overlaps */}
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 w-full">
        <div className="max-w-3xl relative" style={{ height: 380 }}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute top-0 left-0 right-0 transition-opacity duration-700 ease-out ${
                i === current
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold-light mb-6">
                {slide.label}
              </p>

              <h1 className="font-sans text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.05] tracking-wide text-white mb-6">
                {slide.headline}
              </h1>

              <p className="font-sans text-[15px] md:text-[17px] text-white/70 max-w-lg leading-relaxed mb-8">
                {slide.description}
              </p>

              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-4"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-gold/20 border border-brand-gold/30 group-hover:bg-brand-gold/40 transition-all duration-300">
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
      </div>

      {/* Navigation bars with labels — pinned at bottom */}
      <div className="relative z-20 max-w-content mx-auto px-6 md:px-10 w-full pb-10 md:pb-14">
        {/* Bars row */}
        <div className="flex gap-3 md:gap-4">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="cursor-pointer h-[3px] relative overflow-hidden rounded-full"
              style={{ width: "25%" }}
            >
              <span className="absolute inset-0 bg-white/25 rounded-full" />
              {i === current && (
                <span
                  key={progressKey}
                  className="absolute inset-0 bg-brand-gold rounded-full origin-left"
                  style={{
                    animation: `progressBar ${INTERVAL}ms linear forwards`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
        {/* Labels row */}
        <div className="hidden md:flex items-start gap-3 md:gap-4 mt-3">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="cursor-pointer text-left"
              style={{ width: "25%" }}
            >
              <span
                className={`text-[10px] lg:text-[11px] font-sans font-semibold tracking-wider uppercase transition-colors duration-300 ${
                  i === current ? "text-white" : "text-white/40"
                }`}
              >
                {slide.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
