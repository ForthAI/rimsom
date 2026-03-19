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
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6 animate-fade-up">
            About Rimsom
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-light leading-snug animate-fade-up-delay-1">
            A firm built for precision, trust, and lasting influence.
          </h1>
        </div>
      </section>

      {/* Overview */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            The Firm
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8 text-brand-dark">
            Discretion isn&apos;t a limitation — it&apos;s a strategy.
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mb-8" />
          <div className="space-y-6 font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed">
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
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-4">
              Principles
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            ].map((value) => (
              <div key={value.title} className="p-8 border border-brand-light">
                <h3 className="font-serif text-lg font-medium text-brand-dark mb-3">
                  {value.title}
                </h3>
                <div className="w-8 h-[1px] bg-brand-gold mb-3" />
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            Leadership
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8 text-brand-dark">
            Ufo Eric-Atuanya, Esq.
          </h2>
          <p className="font-sans text-xs tracking-widest uppercase text-brand-muted mb-8">
            Chief Executive Officer
          </p>
          <div className="w-12 h-[1px] bg-brand-gold mb-8" />
          <div className="space-y-6 font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed">
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
      </section>

      {/* Vision */}
      <section className="py-24 md:py-32 bg-brand-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            Vision
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8">
            To bridge financial gaps, support job creation, build global supply
            chain resiliency, and catalyze sustainable growth across emerging
            markets.
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto mb-8" />
          <Link
            href="/contact"
            className="inline-block px-10 py-3 text-[11px] font-sans font-medium tracking-widest-plus uppercase border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
          >
            Connect With Us
          </Link>
        </div>
      </section>
    </>
  );
}
