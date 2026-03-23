"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=1000&fit=crop",
    alt: "Energy infrastructure",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=1000&fit=crop",
    alt: "Industrial development",
  },
  {
    src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=1000&fit=crop",
    alt: "Sustainable systems",
  },
];

export default function FadingImages() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-lg">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
          priority={i === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
