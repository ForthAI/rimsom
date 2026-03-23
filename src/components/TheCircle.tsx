"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

const SLIDE_GAP = 24; // px gap between slides

export default function TheCircle() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? "next" : "prev");
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection("next");
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection("prev");
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  // Scrollbar width per slide
  const scrollbarWidth = 100 / slides.length;

  return (
    <section className="relative z-10 bg-white py-20 md:py-28">
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

        {/* Carousel layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — text (fade between slides) */}
          <div className="relative min-h-[280px]">
            {slides.map((slide, i) => (
              <div
                key={slide.title}
                style={{
                  position: i === current ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: i === current ? 1 : 0,
                  transform:
                    i === current
                      ? "translateY(0)"
                      : direction === "next"
                        ? "translateY(16px)"
                        : "translateY(-16px)",
                  transition:
                    "opacity 0.8s ease, transform 0.8s ease",
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

          {/* Right — horizontal sliding images with peek */}
          <div
            ref={containerRef}
            className="relative overflow-visible"
            style={{
              /* clip-path extends right to show the peeking next slide */
              clipPath:
                "polygon(0% 0%, calc(100% + 200px) 0%, calc(100% + 200px) 100%, 0% 100%)",
            }}
          >
            <div className="relative aspect-[4/3]">
              {/* Sliding wrapper — shifts via translateX */}
              <div
                className="absolute top-0 left-0 flex h-full"
                style={{
                  gap: `${SLIDE_GAP}px`,
                  transform: slideWidth > 0
                    ? `translate3d(-${current * (slideWidth + SLIDE_GAP)}px, 0, 0)`
                    : "translate3d(0, 0, 0)",
                  transition: "transform 1s ease",
                  willChange: "transform",
                }}
              >
                {slides.map((slide, i) => (
                  <div
                    key={slide.title}
                    className="relative flex-shrink-0 rounded-lg overflow-hidden"
                    style={{
                      width: slideWidth > 0
                        ? `${slideWidth}px`
                        : "100%",
                      aspectRatio: "4/3",
                      transform:
                        i === current ? "scale(1)" : "scale(0.85)",
                      opacity: i === current ? 1 : 0.6,
                      transition: "transform 1s ease, opacity 1s ease",
                      cursor: i !== current ? "pointer" : "default",
                    }}
                    onClick={() => i !== current && goTo(i)}
                  >
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="mt-10 flex items-center gap-6">
          {/* Scrollbar track */}
          <div className="flex-1 h-[4px] rounded-full bg-gray-200 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: `${scrollbarWidth}%`,
                background: "#c9a84c",
                transform: `translateX(${current * 100}%)`,
                transition: "transform 1s ease",
              }}
            />
          </div>

          {/* Counter + arrows */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-[14px] text-brand-dark tabular-nums font-medium">
              {current + 1}/{slides.length}
            </span>
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
              aria-label="Previous"
            >
              <svg
                className="w-5 h-5 text-brand-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
              aria-label="Next"
            >
              <svg
                className="w-5 h-5 text-brand-dark"
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
            </button>
          </div>
        </div>

        {/* Join the Circle CTA */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-sans text-2xl md:text-[28px] font-bold text-brand-dark mb-4">
              Join the Rimsom Circle
            </h3>
            <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-8">
              Receive the Rimsom Dispatch — insights on global trade,
              development finance, and emerging markets delivered to your inbox.
            </p>
            <form
              className="flex gap-0 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3.5 border border-gray-300 bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-dark text-white text-[13px] font-sans font-semibold hover:bg-brand-navy transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
