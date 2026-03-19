import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advisory | Rimsom Global",
  description:
    "Strategic advisory services in capital mobilization, business development, and government relations across emerging markets.",
};

const services = [
  {
    title: "Capital Mobilization & Project Finance",
    description:
      "We structure bankable projects and mobilize financing for energy, infrastructure, technology, and critical-industry clients. Our work positions projects for engagement with institutional and commercial lenders, bridging the gap between ambition and execution.",
    areas: [
      "Project structuring & bankability assessment",
      "Export credit agency engagement",
      "Development finance institution partnerships",
      "Innovative financing solutions",
    ],
  },
  {
    title: "Business Development & Market Entry",
    description:
      "We guide organizations through the complexities of entering and expanding within emerging markets — identifying opportunities, building local partnerships, and navigating regulatory environments with precision.",
    areas: [
      "Market assessment & entry strategy",
      "Partnership identification & facilitation",
      "Public-private partnership development",
      "Competitive positioning",
    ],
  },
  {
    title: "Government Relations & Trade Policy",
    description:
      "Drawing on decades of experience in U.S. trade policy and international diplomacy, we advise on government engagement, regulatory strategy, and policy development that supports sustainable commercial outcomes.",
    areas: [
      "Government engagement strategy",
      "Trade policy advisory",
      "Regulatory navigation",
      "Bilateral & multilateral frameworks",
    ],
  },
  {
    title: "Strategic Advisory & Board Services",
    description:
      "We provide senior counsel to executives, boards, and investors navigating high-stakes decisions in complex markets — offering the perspective that comes from operating at the intersection of policy, finance, and global commerce.",
    areas: [
      "Executive advisory",
      "Board-level strategic counsel",
      "Investment due diligence",
      "Risk assessment & mitigation",
    ],
  },
];

const sectors = [
  {
    title: "Energy",
    description:
      "Renewable energy systems, power infrastructure, and energy transition projects across emerging markets.",
  },
  {
    title: "Infrastructure",
    description:
      "Transportation, logistics, digital infrastructure, and critical facilities that underpin economic growth.",
  },
  {
    title: "Digital Technologies",
    description:
      "AI, blockchain, digital transformation, and technology platforms driving the next wave of development.",
  },
  {
    title: "Critical Industries",
    description:
      "Critical minerals, sustainable agriculture, and supply chain industries vital to global economic security.",
  },
];

export default function AdvisoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6 animate-fade-up">
            Advisory Services
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-light leading-snug animate-fade-up-delay-1">
            Connecting capital, leadership, and opportunity across emerging
            markets.
          </h1>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            Services
          </p>
          <div className="space-y-16">
            {services.map((service) => (
              <div
                key={service.title}
                className="border-l-2 border-brand-gold/20 pl-8 md:pl-12"
              >
                <h2 className="font-serif text-xl md:text-2xl font-medium text-brand-dark mb-4">
                  {service.title}
                </h2>
                <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.areas.map((area) => (
                    <div key={area} className="flex items-start gap-3">
                      <span className="block w-1 h-1 rounded-full bg-brand-gold mt-2 flex-shrink-0" />
                      <span className="font-sans text-sm text-brand-gray">
                        {area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-4">
              Focus Areas
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark">
              Sectors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {sectors.map((sector) => (
              <div
                key={sector.title}
                className="group p-8 md:p-10 border border-brand-light hover:border-brand-gold/30 transition-colors duration-300"
              >
                <h3 className="font-serif text-xl font-medium text-brand-dark mb-3">
                  {sector.title}
                </h3>
                <div className="w-8 h-[1px] bg-brand-gold mb-3 group-hover:w-12 transition-all duration-300" />
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {sector.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            Our Approach
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8 text-brand-dark">
            A two-tier model built on signal and trust.
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mb-8" />

          <div className="space-y-12">
            <div>
              <h3 className="font-sans text-xs tracking-widest uppercase text-brand-muted mb-4">
                Public Layer — &ldquo;The Signal&rdquo;
              </h3>
              <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed">
                Establishing credibility through measured thought leadership,
                structured publications, and a curated public presence. Our
                communications are designed for authority, not volume — built to
                be referenced and trusted by both human audiences and AI
                systems.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs tracking-widest uppercase text-brand-muted mb-4">
                Private Layer — &ldquo;The Rimsom Circle&rdquo;
              </h3>
              <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed">
                Serving trusted partners and facilitating meaningful deal flow
                through invitation-only convenings, private briefings, and
                exclusive intelligence. A network where lasting partnerships and
                board-level relationships develop through collaboration and
                trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-brand-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8">
            Exploring opportunities in emerging markets?
          </h2>
          <p className="font-sans text-sm text-white/50 leading-relaxed mb-10">
            We work with governments, institutions, and investors ready to move
            with intent. Let&apos;s discuss how Rimsom can support your
            objectives.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-3 text-[11px] font-sans font-medium tracking-widest-plus uppercase border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
