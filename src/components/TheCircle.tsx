"use client";

import { useState, useCallback } from "react";
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

export default function TheCircle() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

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

        {/* Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — text */}
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
                        ? "translateY(20px)"
                        : "translateY(-20px)",
                  transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
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

          {/* Right — 3D perspective image stack */}
          <div
            className="relative aspect-[4/3]"
            style={{ perspective: "1200px" }}
          >
            {slides.map((slide, i) => {
              const diff =
                ((i - current + slides.length) % slides.length);
              // diff: 0 = active, 1 = next, 2 = prev (for 3 slides)

              // Stack: active on top, others behind with depth + slight offset
              let z = 0;
              let translateZ = "-80px";
              let translateX = "24px";
              let translateY = "12px";
              let rotateY = "4deg";
              let opacity = 0.4;
              let scale = 0.92;
              let filter = "brightness(0.6)";

              if (diff === 0) {
                // Active — front and center
                z = 10;
                translateZ = "0px";
                translateX = "0px";
                translateY = "0px";
                rotateY = "0deg";
                opacity = 1;
                scale = 1;
                filter = "brightness(1)";
              } else if (diff === 1) {
                // Next — behind and to the right
                z = 5;
                translateZ = "-60px";
                translateX = "40px";
                translateY = "8px";
                rotateY = "-3deg";
                opacity = 0.55;
                scale = 0.93;
                filter = "brightness(0.65)";
              } else {
                // Previous — further back, to the left
                z = 1;
                translateZ = "-120px";
                translateX = "-20px";
                translateY = "16px";
                rotateY = "5deg";
                opacity = 0.25;
                scale = 0.88;
                filter = "brightness(0.5)";
              }

              return (
                <div
                  key={slide.title}
                  className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    zIndex: z,
                    opacity,
                    filter,
                    transform: `translateX(${translateX}) translateY(${translateY}) translateZ(${translateZ}) rotateY(${rotateY}) scale(${scale})`,
                    transition:
                      "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: diff !== 0 ? "pointer" : "default",
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => diff !== 0 && goTo(i)}
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
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center gap-6">
          {/* Dots */}
          <div className="flex-1 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="group flex flex-col items-start gap-2 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className="h-[3px] rounded-full transition-all duration-500"
                  style={{
                    width: i === current ? 64 : 32,
                    background: i === current ? "#c9a84c" : "#ddd",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand-dark hover:bg-gray-50 transition-all duration-200 active:scale-95"
              aria-label="Previous"
            >
              <svg
                className="w-4 h-4 text-brand-dark"
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
              className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand-dark hover:bg-gray-50 transition-all duration-200 active:scale-95"
              aria-label="Next"
            >
              <svg
                className="w-4 h-4 text-brand-dark"
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
