import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-brand-dark text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="animate-fade-up">
            <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-8">
              Advisory Services
            </p>
          </div>

          <h1 className="animate-fade-up-delay-1 font-serif text-4xl sm:text-5xl md:text-7xl font-light leading-[1.1] tracking-wide mb-8">
            Focused Moves.
            <br />
            Precise Timing.
            <br />
            <span className="text-brand-gold">Lasting Impact.</span>
          </h1>

          <p className="animate-fade-up-delay-2 font-sans text-sm md:text-base text-white/50 max-w-xl mx-auto leading-relaxed mb-12">
            Rimsom Global operates where trust, timing, and access shape what
            happens next — bringing people, capital, and ideas together to
            create outcomes that endure.
          </p>

          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/advisory"
              className="px-8 py-3 text-[11px] font-sans font-medium tracking-widest-plus uppercase border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              Our Advisory
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 text-[11px] font-sans font-medium tracking-widest-plus uppercase text-white/40 hover:text-white transition-colors duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up-delay-3">
          <span className="block w-[1px] h-8 bg-white/20" />
        </div>
      </section>

      {/* Brand Concept */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            Focused Power
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug mb-8 text-brand-dark">
            Real influence isn&apos;t about being everywhere. It&apos;s about
            knowing where to move, and when.
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mb-8" />
          <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed mb-6">
            Rimsom was built for precision. The firm thrives in complexity —
            operating where trust, timing, and access decide everything.
            Movement is never just activity. It&apos;s alignment: bringing
            people, capital, and ideas together to create outcomes that last.
          </p>
          <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed">
            Focused Power means shaping what&apos;s next not through noise or
            visibility, but through timing, trust, and mastery in motion.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-4">
              What We Do
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark">
              Strategic Advisory
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Capital Mobilization",
                description:
                  "Structuring bankable projects and mobilizing financing across energy, infrastructure, technology, and critical industries in emerging markets.",
              },
              {
                title: "Strategic Partnerships",
                description:
                  "Facilitating high-impact alliances between governments, private sector entities, and international institutions to drive transformative change.",
              },
              {
                title: "Policy & Development",
                description:
                  "Advising on trade policy, governance, and sustainable development — informed by decades of public service and private-sector leadership.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group border border-brand-light p-8 md:p-10 hover:border-brand-gold/30 transition-colors duration-300"
              >
                <h3 className="font-serif text-xl font-medium text-brand-dark mb-4">
                  {service.title}
                </h3>
                <div className="w-8 h-[1px] bg-brand-gold mb-4 group-hover:w-12 transition-all duration-300" />
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/advisory"
              className="inline-block text-[11px] font-sans font-medium tracking-widest-plus uppercase text-brand-gray hover:text-brand-dark transition-colors duration-200 border-b border-brand-light hover:border-brand-gold pb-1"
            >
              Explore Our Advisory Services
            </Link>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
                Global Reach
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug mb-8 text-brand-dark">
                Operating across continents where opportunity meets ambition.
              </h2>
              <div className="w-12 h-[1px] bg-brand-gold mb-8" />
              <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed">
                With deep roots in Washington, D.C. and relationships spanning
                the globe, Rimsom Global connects leaders, capital, and ideas at
                the moments that matter most.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
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
                  className="py-4 border-l-2 border-brand-gold/20 pl-4"
                >
                  <span className="font-sans text-sm text-brand-dark font-medium">
                    {region}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-brand-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            The Rimsom Circle
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug mb-8">
            Trusted relationships that shape global outcomes.
          </h2>
          <p className="font-sans text-sm text-white/50 leading-relaxed mb-10">
            We work with a select network of governments, institutions, and
            investors. If you are exploring strategic partnerships in emerging
            markets, we welcome the conversation.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-3 text-[11px] font-sans font-medium tracking-widest-plus uppercase border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
          >
            Begin a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
