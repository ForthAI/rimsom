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
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Podcast: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  Video: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  ),
};

const SLIDE_GAP = 24;

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

  const scrollbarWidth = 100 / slides.length;

  return (
    <section className="relative z-10 overflow-hidden" style={{ background: "linear-gradient(180deg, #f7f3ec 0%, #ffffff 40%, #f7f3ec 100%)" }}>
      <div className="max-w-content mx-auto px-6 md:px-10 py-20 md:py-28">
        {/* Header — brand mark + subscribe */}
        <div className="reveal mb-16">
          {/* Section identity */}
          <div className="flex items-center gap-3 mb-6">
            {/* Circle icon */}
            <div className="w-10 h-10 rounded-full border-2 border-brand-gold flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-brand-gold" />
            </div>
            <span className="text-[13px] font-sans font-bold tracking-widest uppercase text-brand-dark">
              The Circle
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-end">
            <div>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark mb-4">
                Ideas that move markets.
              </h2>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed max-w-lg">
                Articles, podcasts, and video from the Rimsom network — exploring
                global trade, development finance, and the forces shaping
                emerging markets.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="font-sans text-[12px] font-semibold tracking-wide uppercase text-brand-dark">
                  Join the Circle
                </span>
              </div>
              <p className="font-sans text-[13px] text-brand-gray leading-relaxed mb-3">
                Get the Rimsom Dispatch delivered to your inbox.
              </p>
              <form
                className="flex"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 px-3 py-2.5 border border-gray-300 bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200 rounded-l"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-brand-dark text-white text-[11px] font-sans font-semibold tracking-wide uppercase hover:bg-brand-navy transition-colors duration-200 rounded-r whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Content type pills */}
          <div className="flex items-center gap-4 mt-8">
            {["Article", "Podcast", "Video"].map((type) => (
              <div
                key={type}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-brand-gray"
              >
                {typeIcons[type]}
                <span className="font-sans text-[11px] font-semibold tracking-wide uppercase">
                  {type}s
                </span>
              </div>
            ))}
          </div>
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
                        ? "translateY(16px)"
                        : "translateY(-16px)",
                  transition: "opacity 0.8s ease, transform 0.8s ease",
                  pointerEvents: i === current ? "auto" : "none",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold">
                    {typeIcons[slide.type]}
                    <span className="text-[10px] font-semibold tracking-wide uppercase">
                      {slide.type}
                    </span>
                  </span>
                  <span className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gray">
                    {slide.category}
                  </span>
                </div>
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

          {/* Right — sliding images */}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation — scrollbar + arrows */}
        <div className="mt-10 flex items-center gap-6">
          <div className="flex-1 h-[4px] rounded-full bg-black/10 relative overflow-hidden">
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
          <div className="flex items-center gap-3">
            <span className="font-sans text-[14px] text-brand-dark tabular-nums font-medium">
              {current + 1}/{slides.length}
            </span>
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors active:scale-95"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors active:scale-95"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
