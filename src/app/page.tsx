import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";
import VideoSection from "@/components/VideoSection";
import TheCircle from "@/components/TheCircle";
import FadingImages from "@/components/FadingImages";

export default function Home() {
  return (
    <>
      {/* Hero carousel — sticky so next section scrolls over it */}
      <div className="sticky top-0 z-0">
        <HeroCarousel />
      </div>

      {/* 1. GLOBAL REACH — video background, overlaps hero on scroll */}
      <VideoSection />

      {/* 2. POWER & PROGRESS — white section, image + text list */}
      <section className="relative z-10 py-20 md:py-28 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl" />

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Fading feature images */}
            <div className="reveal">
              <FadingImages />
            </div>

            {/* Text content */}
            <div>
              <div className="reveal mb-10">
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                  Power &amp; Progress
                </p>
                <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
                  Building what moves{" "}
                  <span className="text-brand-gold">the world forward.</span>
                </h2>
              </div>

              {[
                {
                  title: "Energy & Infrastructure",
                  description: "Structuring bankable projects across oil & gas, power, and critical infrastructure in emerging markets.",
                  href: "/advisory",
                },
                {
                  title: "Industrial Development",
                  description: "Driving growth in manufacturing, technology, and heavy industry — from concept to commissioning.",
                  href: "/advisory",
                },
                {
                  title: "Sustainable Systems",
                  description: "Integrating renewable energy, resilient design, and responsible governance into every project.",
                  href: "/advisory",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="reveal group py-6"
                  style={{
                    transitionDelay: `${i * 0.1}s`,
                    borderTop: "1px solid #e5e5e5",
                  }}
                >
                  <Link
                    href={item.href}
                    className="font-sans text-lg font-semibold text-brand-dark group-hover:text-brand-blue transition-colors inline-flex items-center gap-2 mb-2"
                  >
                    {item.title}
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
                  </Link>
                  <p className="font-sans text-[14px] text-brand-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPITAL FORMATION — full-bleed image bg with stats */}
      <section className="relative z-10 text-white overflow-hidden">
        {/* Full background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1600&q=80"
            alt="Financial district"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,22,41,0.92) 0%, rgba(22,34,70,0.85) 50%, rgba(26,45,90,0.88) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="reveal text-center max-w-3xl mx-auto mb-16">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
              Capital Formation
            </p>
            <h2 className="font-sans text-3xl md:text-[48px] font-bold leading-[1.1] mb-8">
              When capital needs to move, we know{" "}
              <span className="text-brand-gold">where to direct it.</span>
            </h2>
            <p className="font-sans text-[16px] text-white/60 leading-relaxed">
              From development finance institutions to sovereign wealth funds,
              we structure deals that align risk, return, and impact across
              emerging markets.
            </p>
          </div>

          {/* Stats row */}
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-16" style={{ transitionDelay: "0.15s" }}>
            {[
              { value: "$2B+", label: "Capital Mobilized" },
              { value: "30+", label: "Countries" },
              { value: "15+", label: "Years Experience" },
              { value: "100%", label: "Emerging Markets" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-sans text-4xl md:text-5xl font-bold text-brand-gold mb-2">
                  {stat.value}
                </div>
                <div className="font-sans text-[12px] font-semibold tracking-widest uppercase text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Three capability cards */}
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6" style={{ transitionDelay: "0.25s" }}>
            {[
              {
                title: "Project Finance",
                description: "Structuring bankable deals across energy, infrastructure, and critical industries.",
              },
              {
                title: "Institutional Capital",
                description: "Connecting projects with DFIs, sovereign funds, and institutional investors.",
              },
              {
                title: "Risk & Structuring",
                description: "Aligning risk, return, and impact to move capital from ambition to execution.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-lg border border-white/10 hover:border-brand-gold/30 transition-colors bg-white/5 backdrop-blur-sm"
              >
                <h3 className="font-sans text-lg font-semibold text-white mb-3 group-hover:text-brand-gold transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-[14px] text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal text-center mt-12" style={{ transitionDelay: "0.3s" }}>
            <ArrowLink
              href="/advisory"
              className="text-[13px] font-sans font-semibold text-white"
              dark
            >
              Our advisory services
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* 4. ACCESS = SUCCESS — warm charcoal, split layout with large image */}
      <section className="relative z-10 text-white overflow-hidden" style={{ background: "#1a1a1a" }}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — full-height image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=1000&fit=crop"
              alt="Executive boardroom"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a]/30 hidden md:block" />
          </div>

          {/* Right — content */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-20">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Access = Success
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-8">
                Real influence isn&apos;t about being everywhere. It&apos;s
                about knowing{" "}
                <span className="text-brand-gold">where to move, and when.</span>
              </h2>
              <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-6">
                Rimsom was built for precision. The firm thrives in complexity —
                operating where trust, timing, and access decide everything.
                Movement is never just activity. It&apos;s alignment: bringing
                people, capital, and ideas together to create outcomes that last.
              </p>
              <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-10">
                Decades of relationships across governments, institutions, and
                private sector leaders — that&apos;s the access that drives results.
              </p>
              <ArrowLink
                href="/about"
                className="text-[13px] font-sans font-semibold text-white"
                dark
              >
                About the firm
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* The Circle — insights carousel + CTA */}
      <TheCircle />
    </>
  );
}
