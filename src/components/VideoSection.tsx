"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const regions = [
  {
    region: "Sub-Saharan Africa",
    description: "Energy, infrastructure, and trade across the continent",
    img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=600&h=400&fit=crop",
  },
  {
    region: "Caribbean & Latin America",
    description: "Development finance, governance, and digital transformation",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
  },
  {
    region: "Middle East & Asia",
    description: "Strategic alliances, capital mobilization, and critical industries",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80')",
          }}
        />
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
        <div className="absolute inset-0 bg-brand-navy/75" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="reveal mb-14">
          <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
            Global Reach
          </p>
          <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-white">
            Emerging markets.{" "}
            <span className="text-brand-gold">Enduring impact.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((item, i) => (
            <div
              key={item.region}
              className="reveal img-zoom group"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg mb-5">
                <Image
                  src={item.img}
                  alt={item.region}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <h3 className="font-sans text-xl font-semibold text-white mb-2 group-hover:text-brand-gold-light transition-colors inline-flex items-center gap-2">
                {item.region}
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
              </h3>
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
