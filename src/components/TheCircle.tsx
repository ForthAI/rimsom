"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    type: "Article" as const,
    category: "Development Finance",
    title: "The Outlook on Cross-Continental Development Finance",
    description:
      "How emerging economies are reshaping capital flows and redefining the role of development finance institutions.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=700&fit=crop",
    href: "/insights",
  },
  {
    type: "Podcast" as const,
    category: "Trade & Geopolitics",
    title: "Critical Minerals and the New Geopolitics of Supply",
    description:
      "Why control over rare earths and critical minerals is becoming the defining contest of the next decade.",
    img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=900&h=700&fit=crop",
    href: "/insights",
  },
  {
    type: "Video" as const,
    category: "Technology & Governance",
    title: "AI, Governance, and Africa\u2019s Digital Future",
    description:
      "The intersection of artificial intelligence, regulatory frameworks, and the continent\u2019s path to digital sovereignty.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=700&fit=crop",
    href: "/insights",
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  Article: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Podcast: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  Video: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  ),
};

const SLIDE_GAP = 24;

export default function TheCircle() {
  const [current, setCurrent] = useState(0);
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
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  const scrollbarWidth = 100 / slides.length;

  return (
    <section
      className="relative z-10 overflow-hidden"
      style={{ background: "#f7f3ec" }}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-0">
        {/* Carousel — the main event */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left column — branding flows into content */}
          <div className="flex flex-col">
            {/* Circle mark — always visible, anchors the section */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-full border-2 border-brand-gold flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brand-gold" />
              </div>
              <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-brand-dark">
                The Rimsom Circle
              </span>
            </div>

            {/* Slide content */}
            <div className="relative min-h-[280px] flex-1">
              {slides.map((slide, i) => (
                <div
                  key={slide.title}
                  style={{
                    position: i === current ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: i === current ? 1 : 0,
                    transition: "opacity 0.8s ease",
                    pointerEvents: i === current ? "auto" : "none",
                  }}
                >
                  {/* Type + category on one line */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="inline-flex items-center gap-1 text-brand-gold">
                      {typeIcons[slide.type]}
                      <span className="text-[10px] font-semibold tracking-wider uppercase">
                        {slide.type}
                      </span>
                    </span>
                    <span className="w-px h-3 bg-gray-300" />
                    <span className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-brand-gray">
                      {slide.category}
                    </span>
                  </div>

                  <h3 className="font-sans text-2xl md:text-[30px] font-bold leading-[1.2] text-brand-dark mb-4">
                    {slide.title}
                  </h3>
                  <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-6">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-brand-dark hover:text-brand-blue transition-colors"
                  >
                    {slide.type === "Podcast"
                      ? "Listen now"
                      : slide.type === "Video"
                        ? "Watch now"
                        : "Read the full story"}
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

            {/* Nav controls — flush with bottom of image */}
            <div className="flex items-center gap-4 mt-auto pt-6">
              <div className="flex-1 h-[3px] rounded-full bg-black/10 relative overflow-hidden">
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
              <div className="flex items-center gap-1">
                <span className="font-sans text-[13px] text-brand-gray tabular-nums mr-1">
                  {current + 1}/{slides.length}
                </span>
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors active:scale-95"
                  aria-label="Previous"
                >
                  <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors active:scale-95"
                  aria-label="Next"
                >
                  <svg className="w-4 h-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right column — sliding images */}
          <div
            ref={containerRef}
            className="relative overflow-visible"
            style={{
              clipPath:
                "polygon(0% 0%, calc(100% + 200px) 0%, calc(100% + 200px) 100%, 0% 100%)",
            }}
          >
            <div className="relative aspect-[4/3]">
              <div
                className="absolute top-0 left-0 flex h-full"
                style={{
                  gap: `${SLIDE_GAP}px`,
                  transform:
                    slideWidth > 0
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
                      width: slideWidth > 0 ? `${slideWidth}px` : "100%",
                      aspectRatio: "4/3",
                      transform: i === current ? "scale(1)" : "scale(0.85)",
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
                    {/* Play button overlay for video */}
                    {slide.type === "Video" && i === current && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-brand-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Podcast waveform hint */}
                    {slide.type === "Podcast" && i === current && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                          </svg>
                          <div className="flex items-end gap-[2px] h-4">
                            {[3, 5, 8, 4, 7, 6, 9, 5, 7, 3, 6, 8, 4, 7, 5, 8, 6, 4, 7, 5].map((h, idx) => (
                              <div
                                key={idx}
                                className="w-[2px] bg-white/70 rounded-full"
                                style={{ height: `${h * 1.5}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-white/80 font-sans ml-2">
                            24:30
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Join bar — full-bleed black, tight to content */}
      <div className="mt-10" style={{ background: "linear-gradient(180deg, #f7f3ec 0%, #3d3428 35%)" }}>
        <div className="max-w-content mx-auto px-6 md:px-10 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 items-center">
            <h4 className="font-sans text-[22px] font-bold text-white whitespace-nowrap md:text-right md:pr-4">
              Join the Rimsom Circle to gain access
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-56 md:w-72 px-4 py-2.5 border border-white/20 bg-white/10 text-[14px] text-white font-sans outline-none focus:border-white/50 transition-colors duration-200 rounded placeholder:text-white/40"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-gold text-white text-[12px] font-sans font-semibold tracking-wide uppercase hover:bg-brand-gold-light transition-colors duration-200 rounded whitespace-nowrap"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
