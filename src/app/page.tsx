import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";

export default function Home() {
  return (
    <>
      {/* Hero — full viewport, dark navy */}
      <section className="relative min-h-screen flex items-end bg-brand-navy overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 pb-24 md:pb-32 pt-32 w-full">
          <div className="max-w-3xl">
            <h1 className="animate-fade-up font-serif text-4xl sm:text-5xl md:text-[64px] font-light leading-[1.08] tracking-wide text-white mb-8">
              What&apos;s your next
              <br />
              <span className="ml-12 md:ml-20">focused move?</span>
            </h1>

            <p className="animate-fade-up-delay-1 font-sans text-[15px] md:text-[17px] text-white/60 max-w-lg leading-relaxed mb-10">
              Rimsom Global operates where trust, timing, and access shape
              what happens next — bringing people, capital, and ideas together
              to create outcomes that endure.
            </p>

            <div className="animate-fade-up-delay-2">
              <Link
                href="/advisory"
                className="group inline-flex items-center gap-4"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 group-hover:bg-brand-gold/20 transition-colors duration-300">
                  <svg
                    className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured — cards with gold top border */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-10">
              Our Focus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                category: "Capital",
                title: "Capital Mobilization",
                description:
                  "Structuring bankable projects and mobilizing financing across energy, infrastructure, technology, and critical industries in emerging markets.",
                href: "/advisory",
              },
              {
                category: "Partnerships",
                title: "Strategic Alliances",
                description:
                  "Facilitating high-impact alliances between governments, private sector entities, and international institutions to drive transformative change.",
                href: "/advisory",
              },
              {
                category: "Policy",
                title: "Policy & Development",
                description:
                  "Advising on trade policy, governance, and sustainable development — informed by decades of public service and private-sector leadership.",
                href: "/advisory",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="reveal group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="border-t-[3px] border-brand-gold pt-6">
                  <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
                    {item.category}
                  </p>
                  <ArrowLink
                    href={item.href}
                    className="font-serif text-xl md:text-2xl font-medium text-brand-dark group-hover:text-brand-navy transition-colors duration-200 mb-4"
                  >
                    {item.title}
                  </ArrowLink>
                  <p className="font-sans text-[14px] text-brand-gray leading-relaxed mt-4">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand concept — full-width dark band */}
      <section className="py-20 md:py-28 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Focused Power
              </p>
              <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] mb-8">
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

      {/* Markets */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-6">
                Global Reach
              </p>
              <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark mb-8">
                Operating across continents where opportunity meets ambition.
              </h2>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed">
                With deep roots in Washington, D.C. and relationships spanning
                the globe, Rimsom Global connects leaders, capital, and ideas at
                the moments that matter most.
              </p>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {[
                  "Sub-Saharan Africa",
                  "Caribbean",
                  "Latin America",
                  "Middle East",
                  "Asia",
                  "North America",
                ].map((region) => (
                  <div
                    key={region}
                    className="border-t-[2px] border-brand-gold/30 pt-4"
                  >
                    <span className="font-serif text-[17px] text-brand-dark">
                      {region}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights preview */}
      <section className="py-20 md:py-28 bg-brand-offwhite">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
                Insights
              </p>
              <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark">
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
                className="reveal group bg-white p-8 hover:shadow-lg transition-shadow duration-300"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                  {brief.category}
                </p>
                <h3 className="font-serif text-xl font-medium text-brand-dark leading-snug mb-6">
                  {brief.title}
                </h3>
                <span className="text-[13px] font-sans font-semibold text-brand-gray group-hover:text-brand-dark transition-colors inline-flex items-center gap-2">
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

      {/* CTA — dark band */}
      <section className="py-20 md:py-28 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
              The Rimsom Circle
            </p>
            <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] mb-8">
              Trusted relationships that shape global outcomes.
            </h2>
            <p className="font-sans text-[15px] text-white/50 leading-relaxed mb-10">
              We work with a select network of governments, institutions, and
              investors. If you are exploring strategic partnerships in emerging
              markets, we welcome the conversation.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold hover:bg-brand-gold-light transition-colors duration-200"
            >
              Begin a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
