"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const items = [
  {
    title: "Capital Mobilization",
    description:
      "Structuring bankable projects and mobilizing financing across energy, infrastructure, technology, and critical industries in emerging markets.",
    href: "/advisory",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  },
  {
    title: "Strategic Alliances",
    description:
      "Facilitating high-impact alliances between governments, private sector entities, and international institutions to drive transformative change.",
    href: "/advisory",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    title: "Policy & Development",
    description:
      "Advising on trade policy, governance, and sustainable development — informed by decades of public service and private-sector leadership.",
    href: "/advisory",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop",
  },
];

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setVideoLoaded(true);
    video.addEventListener("canplay", handleCanPlay);

    // Fallback: if video doesn't load in 4s, just show the fallback image
    const timeout = setTimeout(() => {
      if (!videoLoaded) setVideoLoaded(true);
    }, 4000);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      clearTimeout(timeout);
    };
  }, [videoLoaded]);

  return (
    <section className="relative z-10 overflow-hidden rounded-t-[20px]">
      {/* Video background */}
      <div className="absolute inset-0">
        {/* Fallback image (shown while video loads or on mobile) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80')",
          }}
        />
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoLoaded ? 1 : 0, transition: "opacity 1s" }}
        >
          <source
            src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-brand-navy/75" />
        {/* Subtle gradient at top for smooth section transition */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="reveal mb-14">
          <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-white/50 mb-4">
            Our Focus
          </p>
          <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-white">
            Capital. Leadership. Legacy.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="reveal img-zoom group"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="relative aspect-[3/2] overflow-hidden mb-5">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <Link
                href={item.href}
                className="font-sans text-xl font-semibold text-white group-hover:text-brand-gold-light transition-colors inline-flex items-center gap-2 mb-3"
              >
                {item.title}
                <svg
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <p className="font-sans text-[14px] text-white/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
