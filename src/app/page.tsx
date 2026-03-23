import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";
import VideoSection from "@/components/VideoSection";

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
            {/* Large feature image */}
            <div className="reveal">
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=1000&fit=crop"
                  alt="Energy infrastructure"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

            {/* Text content */}
            <div>
              <div className="reveal mb-10">
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                  Power &amp; Progress
                </p>
                <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
                  Building what moves{" "}
                  <span className="text-brand-blue">the world forward.</span>
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

      {/* 4. ACCESS = SUCCESS — full-bleed image with centered quote + cards */}
      <section className="relative z-10 text-white overflow-hidden">
        {/* Full background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80"
            alt="Executive meeting"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,26,26,0.93) 0%, rgba(42,37,32,0.88) 50%, rgba(26,26,26,0.95) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 py-20 md:py-28">
          {/* Large centered pull quote */}
          <div className="reveal text-center max-w-4xl mx-auto mb-16">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-8">
              Access = Success
            </p>
            <h2 className="font-sans text-3xl md:text-[52px] font-bold leading-[1.1] mb-8">
              Real influence isn&apos;t about being everywhere.
            </h2>
            <p className="font-sans text-xl md:text-2xl text-brand-gold/80 font-medium leading-snug">
              It&apos;s about knowing where to move, and when.
            </p>
          </div>

          {/* Two-column feature cards */}
          <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-8" style={{ transitionDelay: "0.15s" }}>
            <div className="p-8 md:p-10 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="font-sans text-xl font-semibold text-white mb-3">
                Government & Institutional Access
              </h3>
              <p className="font-sans text-[15px] text-white/50 leading-relaxed">
                Decades of relationships across governments, multilateral institutions,
                and sovereign entities. We open doors that create lasting partnerships
                and transformative outcomes.
              </p>
            </div>
            <div className="p-8 md:p-10 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="font-sans text-xl font-semibold text-white mb-3">
                Private Sector Leadership
              </h3>
              <p className="font-sans text-[15px] text-white/50 leading-relaxed">
                Connecting global investors, industry leaders, and private capital
                with high-impact opportunities. Precision networking that turns
                introductions into investments.
              </p>
            </div>
          </div>

          <div className="reveal text-center mt-12" style={{ transitionDelay: "0.25s" }}>
            <ArrowLink
              href="/about"
              className="text-[13px] font-sans font-semibold text-white"
              dark
            >
              About the firm
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* Insights preview — warm sand */}
      <section className="relative z-10 py-20 md:py-28" style={{ background: "#f7f3ec" }}>
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
                Insights
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
                Rimsom Dispatch
              </h2>
            </div>
            <ArrowLink
              href="/insights"
              className="hidden md:inline-flex text-[13px] font-sans font-semibold text-brand-dark"
            >
              View all
            </ArrowLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: "Development Finance",
                title: "The Outlook on Cross-Continental Development Finance",
              },
              {
                category: "Trade & Geopolitics",
                title: "Critical Minerals and the New Geopolitics of Supply",
              },
              {
                category: "Technology & Governance",
                title: "AI, Governance, and Africa\u2019s Digital Future",
              },
            ].map((brief, i) => (
              <div
                key={brief.title}
                className="reveal group bg-white p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gold" />
                </div>
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mt-4 mb-4">
                  {brief.category}
                </p>
                <h3 className="font-sans text-xl font-medium text-brand-dark leading-snug mb-6">
                  {brief.title}
                </h3>
                <span className="text-[13px] font-sans font-semibold text-brand-gray group-hover:text-brand-blue transition-colors inline-flex items-center gap-2">
                  Forthcoming
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
                </span>
              </div>
            ))}
          </div>

          <div className="md:hidden mt-8 reveal">
            <ArrowLink
              href="/insights"
              className="text-[13px] font-sans font-semibold text-brand-dark"
            >
              View all insights
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* CTA — rich emerald gradient */}
      <section className="relative z-10 py-20 md:py-28 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)" }}>
        <div className="absolute top-10 right-[20%] w-48 h-48 rounded-full bg-brand-gold/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-[15%] w-64 h-64 rounded-full bg-emerald-300/10 blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold-light mb-6">
              The Rimsom Circle
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-8">
              Trusted relationships that shape{" "}
              global outcomes.
            </h2>
            <p className="font-sans text-[15px] text-white/50 leading-relaxed mb-10">
              We work with a select network of governments, institutions, and
              investors. If you are exploring strategic partnerships in emerging
              markets, we welcome the conversation.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold hover:bg-brand-gold-light transition-colors duration-200 shadow-lg shadow-brand-gold/20"
            >
              Begin a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
