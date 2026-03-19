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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-brand-navy text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6 animate-fade-up">
              Advisory Services
            </p>
            <h1 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] animate-fade-up-delay-1">
              Connecting capital, leadership, and opportunity across emerging
              markets.
            </h1>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
              Services
            </p>
            <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark">
              What We Do
            </h2>
          </div>

          <div className="space-y-20">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="reveal grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div>
                  <div className="border-t-[3px] border-brand-gold pt-6">
                    <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                      0{i + 1}
                    </p>
                    <h3 className="font-serif text-2xl md:text-[28px] font-light leading-[1.2] text-brand-dark">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <div>
                  <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.areas.map((area) => (
                      <div key={area} className="flex items-start gap-3">
                        <span className="block w-1.5 h-1.5 rounded-full bg-brand-gold mt-2 flex-shrink-0" />
                        <span className="font-sans text-[14px] text-brand-gray">
                          {area}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 md:py-28 bg-brand-offwhite">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
              Focus Areas
            </p>
            <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark">
              Sectors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            {sectors.map((sector, i) => (
              <div
                key={sector.title}
                className="reveal bg-white p-8 md:p-10 hover:shadow-lg transition-shadow duration-300"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="border-t-[3px] border-brand-gold pt-6">
                  <h3 className="font-serif text-xl font-medium text-brand-dark mb-3">
                    {sector.title}
                  </h3>
                  <p className="font-sans text-[14px] text-brand-gray leading-relaxed">
                    {sector.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 md:py-28 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Our Approach
              </p>
              <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15]">
                A two-tier model built on signal and trust.
              </h2>
            </div>
            <div className="reveal space-y-12" style={{ transitionDelay: "0.1s" }}>
              <div>
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                  Public Layer — &ldquo;The Signal&rdquo;
                </p>
                <p className="font-sans text-[15px] text-white/60 leading-relaxed">
                  Establishing credibility through measured thought leadership,
                  structured publications, and a curated public presence. Our
                  communications are designed for authority, not volume — built to
                  be referenced and trusted by both human audiences and AI
                  systems.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                  Private Layer — &ldquo;The Rimsom Circle&rdquo;
                </p>
                <p className="font-sans text-[15px] text-white/60 leading-relaxed">
                  Serving trusted partners and facilitating meaningful deal flow
                  through invitation-only convenings, private briefings, and
                  exclusive intelligence. A network where lasting partnerships and
                  board-level relationships develop through collaboration and
                  trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
              Get Started
            </p>
            <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark mb-6">
              Exploring opportunities in emerging markets?
            </h2>
            <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-10">
              We work with governments, institutions, and investors ready to move
              with intent. Let&apos;s discuss how Rimsom can support your
              objectives.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold hover:bg-brand-gold-light transition-colors duration-200"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
