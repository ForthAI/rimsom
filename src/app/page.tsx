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

      {/* Focus areas — video background, overlaps hero on scroll */}
      <VideoSection />

      {/* Where We Operate — clean white */}
      <section className="relative z-10 py-20 md:py-28 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl" />

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
              Where We Operate
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
              Emerging markets.<br />
              Enduring impact.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                region: "Sub-Saharan Africa",
                description: "Energy, infrastructure, and trade across the continent",
                img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop",
              },
              {
                region: "Caribbean & Latin America",
                description: "Development finance, governance, and digital transformation",
                img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              },
              {
                region: "Middle East & Asia",
                description: "Strategic alliances, capital mobilization, and critical industries",
                img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop",
              },
            ].map((item, i) => (
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
                <h3 className="font-sans text-xl font-medium text-brand-dark mb-2 group-hover:text-brand-blue transition-colors inline-flex items-center gap-2">
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
                <p className="font-sans text-[14px] text-brand-gray leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand concept — dark sky with stars */}
      <section className="relative z-10 py-20 md:py-28 text-white overflow-hidden" style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #0f172a 100%)" }}>
        {/* Stars */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 8%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 45%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 85% 55%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 60%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 75%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 50% 70%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 65% 85%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 40%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 92% 12%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 5% 90%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 48% 25%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 65%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 50%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 78%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 20% 88%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 5%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 95% 92%, rgba(255,255,255,0.3) 0%, transparent 100%)
          `
        }} />
        {/* Subtle nebula glow */}
        <div className="absolute top-[20%] left-[30%] w-96 h-96 rounded-full bg-blue-900/20 blur-3xl" />
        <div className="absolute bottom-[10%] right-[20%] w-72 h-72 rounded-full bg-indigo-900/15 blur-3xl" />

        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Focused Power
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-8">
                Real influence isn&apos;t about being everywhere. It&apos;s
                about knowing where to move, and when.
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
                Focused Power means shaping what&apos;s next not through noise
                or visibility, but through timing, trust, and mastery in motion.
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
