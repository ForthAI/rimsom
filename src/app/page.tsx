import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  return (
    <>
      {/* Hero carousel */}
      <HeroCarousel />

      {/* Focus areas — vibrant blue band with large images */}
      <section className="pt-0 pb-16 md:pb-24 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #162246 0%, #2251ff 30%, #2251ff 100%)" }}>
        {/* Gold accent lines at top of blue section */}
        <div className="w-full reveal gold-lines-draw" style={{ transitionDuration: "1.2s" }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: "120px" }}>
            {/* Line 1 — descends left to right, wavy */}
            <path d="M0 15 C300 8, 500 35, 720 25 S1100 45, 1440 70" stroke="#c9a84c" strokeWidth="1" opacity="0.2" fill="none" />
            {/* Line 2 — rises then falls, crosses Line 1 */}
            <path d="M0 60 C240 45, 480 22, 720 38 S960 60, 1200 35 C1320 25, 1380 28, 1440 30" stroke="#c9a84c" strokeWidth="2" opacity="0.45" fill="none" />
            {/* Line 3 — straight diagonal crossing others */}
            <line x1="0" y1="78" x2="1440" y2="22" stroke="#c9a84c" strokeWidth="1.5" opacity="0.3" />
            {/* Line 4 — bold wave, dips and rises */}
            <path d="M0 42 C180 55, 360 85, 600 70 S840 35, 1080 52 Q1260 68, 1440 58" stroke="#c9a84c" strokeWidth="3" opacity="0.55" fill="none" />
            {/* Line 5 — tight ripple, brightest */}
            <path d="M0 95 C120 88, 240 105, 420 85 S600 100, 780 80 S960 95, 1140 78 Q1300 90, 1440 84" stroke="#c9a84c" strokeWidth="2.5" opacity="0.75" fill="none" />
            {/* Line 6 — gentle rise, thin */}
            <line x1="0" y1="108" x2="1440" y2="78" stroke="#c9a84c" strokeWidth="1" opacity="0.35" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-cyan/8 blur-3xl" />

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 pt-16 md:pt-20">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-white/50 mb-4">
              Our Focus
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-white">
              Capital. Leadership. Legacy.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
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
            ].map((item, i) => (
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

      {/* Where We Operate — dark navy */}
      <section className="py-14 md:py-20 bg-brand-navy relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-cyan/10 blur-3xl animate-float-slower" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-brand-gold/10 blur-3xl animate-float-slow" />

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-white/60 mb-4">
              Where We Operate
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-white">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                </div>
                <h3 className="font-sans text-xl font-medium text-white mb-2 group-hover:text-brand-gold-light transition-colors inline-flex items-center gap-2">
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

      {/* Brand concept — dark navy with accent elements */}
      <section className="py-20 md:py-28 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute top-10 left-[10%] w-2 h-2 rounded-full bg-brand-gold" />
        <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse-glow" />
        <div className="absolute bottom-[20%] left-[25%] w-1 h-1 rounded-full bg-brand-blue-light animate-pulse-glow" />

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

      {/* Insights preview — light section */}
      <section className="py-20 md:py-28 bg-brand-offwhite">
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

      {/* CTA — gradient band */}
      <section className="py-20 md:py-28 bg-gradient-animated text-white relative overflow-hidden">
        <div className="absolute top-10 right-[20%] w-48 h-48 rounded-full bg-brand-gold/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-[15%] w-64 h-64 rounded-full bg-brand-cyan/5 blur-3xl animate-float-slower" />

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
