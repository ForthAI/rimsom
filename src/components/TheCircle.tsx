"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    category: "Development Finance",
    title: "The Outlook on Cross-Continental Development Finance",
    description:
      "How emerging economies are reshaping capital flows and redefining the role of development finance institutions.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=700&fit=crop",
    href: "/insights",
  },
  {
    category: "Trade & Geopolitics",
    title: "Critical Minerals and the New Geopolitics of Supply",
    description:
      "Why control over rare earths and critical minerals is becoming the defining contest of the next decade.",
    img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=900&h=700&fit=crop",
    href: "/insights",
  },
  {
    category: "Technology & Governance",
    title: "AI, Governance, and Africa\u2019s Digital Future",
    description:
      "The intersection of artificial intelligence, regulatory frameworks, and the continent\u2019s path to digital sovereignty.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=700&fit=crop",
    href: "/insights",
  },
];

const DURATION = 7000;

export default function TheCircle() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-advance + progress bar
  useEffect(() => {
    if (paused) return;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setCurrent((c) => (c + 1) % slides.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
    };

    intervalRef.current = setInterval(tick, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current, paused]);

  return (
    <section className="relative z-10 bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="reveal mb-14">
          <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
            The Circle
          </p>
          <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
            Trusted relationships that shape global outcomes.
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left — text */}
          <div className="relative">
            {slides.map((slide, i) => (
              <div
                key={slide.title}
                className="transition-all duration-500"
                style={{
                  opacity: i === current ? 1 : 0,
                  transform: i === current ? "translateY(0)" : "translateY(12px)",
                  position: i === current ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  pointerEvents: i === current ? "auto" : "none",
                }}
              >
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                  {slide.category}
                </p>
                <h3 className="font-sans text-2xl md:text-[32px] font-bold leading-[1.15] text-brand-dark mb-5">
                  {slide.title}
                </h3>
                <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-8">
                  {slide.description}
                </p>
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-brand-dark hover:text-brand-blue transition-colors"
                >
                  Read the full story
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          {/* Right — image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            {slides.map((slide, i) => (
              <Image
                key={slide.title}
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover transition-opacity duration-700"
                style={{ opacity: i === current ? 1 : 0 }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            ))}
          </div>
        </div>

        {/* Progress bars + nav */}
        <div className="mt-10 flex items-center gap-6">
          {/* Progress segments */}
          <div className="flex-1 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex-1 h-[3px] rounded-full overflow-hidden bg-gray-200 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width:
                      i === current
                        ? `${progress}%`
                        : i < current
                          ? "100%"
                          : "0%",
                    background: i <= current ? "#c9a84c" : "transparent",
                    transition: i === current ? "none" : "width 0.3s",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Counter + arrows */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-[13px] text-brand-gray tabular-nums">
              {current + 1}/{slides.length}
            </span>
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-brand-dark hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-brand-dark hover:bg-gray-50 transition-colors"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-12 border-t border-gray-200 text-center">
          <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-6 max-w-xl mx-auto">
            We work with a select network of governments, institutions, and
            investors. If you are exploring strategic partnerships in emerging
            markets, we welcome the conversation.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-brand-dark text-white text-[13px] font-sans font-semibold hover:bg-brand-navy transition-colors duration-200"
          >
            Begin a Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}
