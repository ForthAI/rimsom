import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Rimsom Global",
  description:
    "Rimsom Global is a discreet, high-trust advisory firm that helps shape high-stakes, high-impact deals across continents.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-animated text-white overflow-hidden">
        <div className="absolute top-20 right-[15%] w-48 h-48 rounded-full bg-brand-cyan/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-[10%] w-64 h-64 rounded-full bg-brand-gold/10 blur-3xl animate-float-slower" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold-light mb-6 animate-fade-up">
              About Rimsom
            </p>
            <h1 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] animate-fade-up-delay-1">
              A firm built for precision, trust, and <span className="shimmer-gold">lasting influence.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-6">
                The Firm
              </p>
              <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark">
                Discretion isn&apos;t a limitation — it&apos;s a strategy.
              </h2>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="space-y-6 font-sans text-[15px] text-brand-gray leading-relaxed">
                <p>
                  Rimsom Global is a Washington, D.C.-based advisory firm providing
                  business development, strategy, financial advisory, and government
                  relations services. The firm works with governments, private sector
                  organizations, and international institutions in emerging markets.
                </p>
                <p>
                  Where others chase visibility, Rimsom builds credibility. The
                  firm&apos;s strength comes from influence, access, and the trust
                  earned through decades of consistent, high-impact engagement across
                  continents.
                </p>
                <p>
                  With over 30 years of experience in international business
                  development, policy, and finance, Rimsom Global leverages deep
                  expertise to facilitate large-scale investments and strategic
                  partnerships that support economic growth, competitiveness, and
                  sustainability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-brand-offwhite">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
              Principles
            </p>
            <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                title: "Innovation",
                description:
                  "Promoting creative, forward-thinking solutions to global challenges, particularly in emerging markets.",
              },
              {
                title: "Integrity",
                description:
                  "Upholding the highest standards of transparency, ethics, and accountability in all our dealings.",
              },
              {
                title: "Sustainability",
                description:
                  "Fostering long-term growth that benefits people, the planet, and business profitability.",
              },
              {
                title: "Collaboration",
                description:
                  "Building strong, mutually beneficial partnerships across sectors to drive transformative change.",
              },
              {
                title: "Excellence",
                description:
                  "Delivering exceptional services that contribute to business growth, job creation, and resilient global supply chains.",
              },
              {
                title: "Discretion",
                description:
                  "Operating with the measured restraint that defines trusted advisors — present when it matters, never reactive.",
              },
            ].map((value, i) => (
              <div
                key={value.title}
                className="reveal bg-white p-8"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="relative pt-6">
                  <div className="absolute top-0 left-0 right-0 h-[3px] shimmer-gold-line" />
                  <h3 className="font-serif text-xl font-medium text-brand-dark mb-3">
                    {value.title}
                  </h3>
                  <p className="font-sans text-[14px] text-brand-gray leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-6">
                Leadership
              </p>
              <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] text-brand-dark mb-4">
                Ufo Eric-Atuanya, Esq.
              </h2>
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted">
                Chief Executive Officer
              </p>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="space-y-6 font-sans text-[15px] text-brand-gray leading-relaxed">
                <p>
                  Ufo Eric-Atuanya is a global business development executive and
                  international trade strategist with more than 30 years of
                  experience advancing U.S. commercial engagement and market-based
                  finance across emerging markets.
                </p>
                <p>
                  His career bridges public service and private-sector leadership,
                  with a consistent focus on mobilizing capital, expanding U.S.
                  exports, and building sustainable market ecosystems.
                </p>
                <p>
                  Previously, Mr. Eric-Atuanya served as Senior Vice President for
                  Global Business Development and Senior Advisor on Africa at the
                  Export-Import Bank of the United States (EXIM), where he helped
                  drive a record expansion of EXIM&apos;s Sub-Saharan Africa
                  portfolio.
                </p>
                <p>
                  Earlier in his career, he served as Trade Counsel to the Chairman
                  of the U.S. House Committee on Ways and Means, where he played an
                  instrumental role in the bipartisan passage of key legislation
                  including the African Growth and Opportunity Act (AGOA). He also
                  served as Senior Trade Policy Advisor to the U.S. Secretary of
                  Commerce.
                </p>
                <p>
                  Mr. Eric-Atuanya is admitted to practice law in the State of New
                  York and holds a Juris Doctor from the American University
                  Washington College of Law and a Bachelor of Science from Weber
                  State University. He serves on the board of Papyrus International
                  and as Senior Advisor to the Institutional Investors Network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision CTA */}
      <section className="py-20 md:py-28 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
              Vision
            </p>
            <h2 className="font-serif text-3xl md:text-[42px] font-light leading-[1.15] mb-10">
              To bridge financial gaps, support job creation, build global supply
              chain resiliency, and catalyze sustainable growth across emerging
              markets.
            </h2>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold hover:bg-brand-gold-light transition-colors duration-200"
            >
              Connect With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
