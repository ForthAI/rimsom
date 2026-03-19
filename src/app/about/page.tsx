import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Rimsom Global",
  description:
    "Rimsom Global is a discreet, high-trust advisory firm that helps shape high-stakes, high-impact deals across continents.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-brand-navy/85" />
        <div className="absolute top-20 right-[15%] w-48 h-48 rounded-full bg-brand-blue/10 blur-3xl animate-float-slow" />
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold-light mb-6 animate-fade-up">
              About Rimsom
            </p>
            <h1 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] animate-fade-up-delay-1">
              A firm built for precision, trust, and lasting influence.
            </h1>
          </div>
        </div>
      </section>

      {/* Overview — with image */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-6">
                The Firm
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark mb-8">
                Discretion isn&apos;t a limitation — it&apos;s a strategy.
              </h2>
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
              </div>
            </div>
            <div className="reveal img-zoom">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&h=600&fit=crop"
                  alt="Global business strategy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Additional text below */}
          <div className="reveal mt-16 max-w-3xl">
            <p className="font-sans text-[15px] text-brand-gray leading-relaxed">
              With over 30 years of experience in international business
              development, policy, and finance, Rimsom Global leverages deep
              expertise to facilitate large-scale investments and strategic
              partnerships that support economic growth, competitiveness, and
              sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* Values — with icons/images */}
      <section className="py-20 md:py-28 bg-brand-offwhite">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-14">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
              Principles
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                title: "Innovation",
                description:
                  "Promoting creative, forward-thinking solutions to global challenges, particularly in emerging markets.",
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
              },
              {
                title: "Integrity",
                description:
                  "Upholding the highest standards of transparency, ethics, and accountability in all our dealings.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
              {
                title: "Sustainability",
                description:
                  "Fostering long-term growth that benefits people, the planet, and business profitability.",
                icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Collaboration",
                description:
                  "Building strong, mutually beneficial partnerships across sectors to drive transformative change.",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                title: "Excellence",
                description:
                  "Delivering exceptional services that contribute to business growth, job creation, and resilient global supply chains.",
                icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
              },
              {
                title: "Discretion",
                description:
                  "Operating with the measured restraint that defines trusted advisors — present when it matters, never reactive.",
                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
              },
            ].map((value, i) => (
              <div
                key={value.title}
                className="reveal bg-white p-8 hover:shadow-lg transition-shadow duration-300"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-brand-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
                  </svg>
                </div>
                <h3 className="font-sans text-xl font-medium text-brand-dark mb-3">
                  {value.title}
                </h3>
                <p className="font-sans text-[14px] text-brand-gray leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal — with headshot */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-12 md:gap-20 items-start">
            {/* Photo */}
            <div className="reveal">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-brand-offwhite">
                <Image
                  src="/ufo.jpg"
                  alt="Ufo Eric-Atuanya, Esq."
                  fill
                  className="object-cover object-top"
                  sizes="320px"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-6">
                Leadership
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark mb-2">
                Ufo Eric-Atuanya, Esq.
              </h2>
              <p className="text-[13px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-8">
                Chief Executive Officer
              </p>
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

      {/* Vision CTA — with background image */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-brand-navy/90" />
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
              Vision
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-10">
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
