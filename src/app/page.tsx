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

      {/* 2. POWER & PROGRESS — white section with service cards */}
      <section className="relative z-10 py-20 md:py-28 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl" />

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
              Power &amp; Progress
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
              Building what moves{" "}
              <span className="text-brand-blue">the world forward.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Energy & Infrastructure",
                description: "Structuring bankable projects across oil & gas, power, and critical infrastructure in emerging markets.",
                href: "/advisory",
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
              },
              {
                title: "Industrial Development",
                description: "Driving growth in manufacturing, technology, and heavy industry — from concept to commissioning.",
                href: "/advisory",
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
              },
              {
                title: "Sustainable Systems",
                description: "Integrating renewable energy, resilient design, and responsible governance into every project.",
                href: "/advisory",
                img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="reveal img-zoom group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg mb-5">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <Link
                  href={item.href}
                  className="font-sans text-xl font-medium text-brand-dark mb-2 group-hover:text-brand-blue transition-colors inline-flex items-center gap-2"
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
                <p className="font-sans text-[14px] text-brand-gray leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAPITAL FORMATION — dark navy */}
      <section className="relative z-10 py-20 md:py-28 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #0f1629 0%, #162246 50%, #1a2d5a 100%)" }}>
        <div className="absolute top-[20%] left-[30%] w-96 h-96 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[20%] w-72 h-72 rounded-full bg-brand-gold/5 blur-3xl" />

        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Capital Formation
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-8">
                When capital needs to move, we know{" "}
                <span className="text-brand-gold">where to direct it.</span>
              </h2>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-6">
                Rimsom mobilizes financing for energy, infrastructure, and critical
                industries — connecting projects with the capital they need to
                move from ambition to execution.
              </p>
              <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-8">
                From development finance institutions to sovereign wealth funds,
                we structure deals that align risk, return, and impact across
                emerging markets.
              </p>
              <ArrowLink
                href="/advisory"
                className="text-[13px] font-sans font-semibold text-white"
                dark
              >
                Our advisory services
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACCESS = SUCCESS — warm charcoal with gold accents */}
      <section className="relative z-10 py-20 md:py-28 text-white overflow-hidden" style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #2a2520 50%, #1a1a1a 100%)" }}>
        <div className="absolute top-0 left-[40%] w-80 h-80 rounded-full bg-brand-gold/8 blur-3xl" />

        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Access = Success
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-8">
                Real influence isn&apos;t about being everywhere. It&apos;s
                about knowing{" "}
                <span className="text-brand-gold">where to move, and when.</span>
              </h2>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-6">
                Rimsom was built for precision. The firm thrives in complexity —
                operating where trust, timing, and access decide everything.
                Movement is never just activity. It&apos;s alignment: bringing
                people, capital, and ideas together to create outcomes that last.
              </p>
              <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-8">
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
