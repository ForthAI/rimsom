import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "The Circle | Rimsom Global",
  description:
    "Articles, podcasts, and video from the Rimsom network — exploring global trade, development finance, and the forces shaping emerging markets.",
};

const content = [
  {
    type: "article" as const,
    category: "Development Finance",
    title: "The Outlook on Cross-Continental Development Finance",
    description:
      "An analysis of capital flows, investment frameworks, and financing mechanisms shaping infrastructure and energy projects across emerging markets.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    locked: true,
  },
  {
    type: "podcast" as const,
    category: "Trade & Geopolitics",
    title: "Critical Minerals and the New Geopolitics of Supply",
    description:
      "How shifting supply chain dynamics and resource competition are reshaping international partnerships and investment strategies.",
    image:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&h=400&fit=crop",
    locked: true,
  },
  {
    type: "video" as const,
    category: "Technology & Governance",
    title: "AI, Governance, and Africa\u2019s Digital Future",
    description:
      "The intersection of artificial intelligence, regulatory frameworks, and the continent\u2019s path to digital sovereignty.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    locked: true,
  },
  {
    type: "article" as const,
    category: "Infrastructure",
    title: "Building Bankable Projects in Frontier Markets",
    description:
      "Lessons from structuring energy and infrastructure deals where institutional capital meets developmental impact.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    locked: true,
  },
  {
    type: "podcast" as const,
    category: "Capital Markets",
    title: "Sovereign Wealth and the Next Wave of African Investment",
    description:
      "A conversation on how sovereign funds are repositioning for long-term growth across the continent.",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop",
    locked: true,
  },
  {
    type: "video" as const,
    category: "Convenings",
    title: "Triple Ai (3Ai): Africa Alliance for Artificial Intelligence",
    description:
      "Highlights from a convening of leaders in AI, governance, and international finance shaping Africa\u2019s digital trajectory.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    locked: true,
  },
];

const typeIcons = {
  article: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  podcast: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  video: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
};

export default function CirclePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-brand-navy/85" />
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 mb-6 animate-fade-up">
            <img src="/globe.svg" alt="Rimsom" className="w-10 h-10" />
            <p className="text-[13px] font-sans font-semibold tracking-widest uppercase text-brand-gold-light">
              The Rimsom Circle
            </p>
          </div>
          <h1 className="font-sans text-3xl md:text-[48px] font-bold leading-[1.1] max-w-3xl mb-6 animate-fade-up-delay-1">
            Ideas that move markets.
          </h1>
          <p className="font-sans text-[16px] text-white/60 leading-relaxed max-w-2xl animate-fade-up-delay-2">
            Articles, podcasts, and video from the Rimsom network — exploring
            global trade, development finance, and the forces shaping emerging
            markets.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-20 md:py-28 bg-[#f7f3ec]">
        <div className="max-w-content mx-auto px-6 md:px-10">
          {/* Filter pills */}
          <div className="flex items-center gap-3 mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark text-white text-[11px] font-sans font-semibold tracking-wider uppercase rounded-sm">
              All
            </span>
            {(["article", "podcast", "video"] as const).map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-2 px-4 py-2 border border-brand-dark/15 text-brand-dark/60 text-[11px] font-sans font-semibold tracking-wider uppercase rounded-sm hover:border-brand-dark/40 hover:text-brand-dark transition-colors cursor-pointer"
              >
                {typeIcons[type]}
                {type === "article"
                  ? "Articles"
                  : type === "podcast"
                    ? "Podcasts"
                    : "Videos"}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((item, i) => (
              <Link
                key={item.title}
                href="/login"
                className="reveal group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Lock overlay */}
                  {item.locked && (
                    <div className="absolute inset-0 bg-brand-navy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/95 rounded-full px-5 py-2.5 flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#162246"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-[12px] font-sans font-semibold text-brand-navy">
                          Log in to access
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-dark text-[10px] font-sans font-semibold tracking-wider uppercase rounded-sm">
                      {typeIcons[item.type]}
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div className="p-6">
                  <p className="text-[10px] font-sans font-semibold tracking-widest uppercase text-brand-gold mb-3">
                    {item.category}
                  </p>
                  <h3 className="font-sans text-lg font-semibold text-brand-dark leading-snug mb-3 group-hover:text-brand-blue transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[13px] text-brand-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <h2 className="font-sans text-2xl md:text-3xl font-bold mb-4">
              Join the Rimsom Circle
            </h2>
            <p className="font-sans text-[15px] text-white/50 leading-relaxed mb-8">
              Get access to the full archive of articles, podcasts, and video —
              plus the Rimsom Dispatch delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-80 px-5 py-3 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-white/40 text-[14px] font-sans outline-none focus:border-brand-gold transition-colors"
              />
              <button className="px-8 py-3 bg-brand-gold text-white text-[12px] font-sans font-semibold tracking-wider uppercase rounded-sm hover:bg-brand-gold-light transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
