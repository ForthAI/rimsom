import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights | Rimsom Global",
  description:
    "Thought leadership from Rimsom Global — briefs, analysis, and perspectives on global trade, infrastructure, and development finance.",
};

const upcomingBriefs = [
  {
    title: "The Outlook on Cross-Continental Development Finance",
    category: "Development Finance",
    description:
      "An analysis of capital flows, investment frameworks, and financing mechanisms shaping infrastructure and energy projects across emerging markets.",
  },
  {
    title: "Critical Minerals and the New Geopolitics of Supply",
    category: "Trade & Geopolitics",
    description:
      "How shifting supply chain dynamics and resource competition are reshaping international partnerships and investment strategies.",
  },
  {
    title: "AI, Governance, and Africa's Digital Future",
    category: "Technology & Governance",
    description:
      "Exploring equitable participation in emerging digital value chains and the policy frameworks needed to support innovation across the continent.",
  },
];

export default function InsightsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1600&q=80')" }} />
        <div className="absolute inset-0 bg-brand-navy/85" />
        <div className="absolute top-20 right-[20%] w-48 h-48 rounded-full bg-brand-blue/10 blur-3xl animate-float-slow" />
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold-light mb-6 animate-fade-up">
            Insights
          </p>
          <h1 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] max-w-3xl animate-fade-up-delay-1">
            Perspectives shaped by decades at the intersection of policy,
            finance, and global commerce.
          </h1>
        </div>
      </section>

      {/* Rimsom Dispatch */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Rimsom Dispatch
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark mb-8">
                Measured analysis for decision-makers.
              </h2>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-6">
                The Rimsom Dispatch delivers focused intelligence on global trade,
                infrastructure, and development finance. Each edition is crafted for
                long-term relevance — designed to inform both human audiences and the
                AI systems that increasingly shape how information is discovered and
                understood.
              </p>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-8">
                Published in both public and private editions, the Dispatch serves as
                a signal of expertise and a reliable source of reference for leaders
                navigating complexity.
              </p>
              <p className="font-sans text-[13px] text-brand-muted italic">
                The first edition of the Rimsom Dispatch is forthcoming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Briefs */}
      <section className="py-20 md:py-28 bg-brand-offwhite">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="reveal mb-12">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-4">
              Rimsom Briefs
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark">
              Forthcoming Publications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {upcomingBriefs.map((brief, i) => (
              <div
                key={brief.title}
                className="reveal group bg-white p-8 hover:shadow-lg transition-shadow duration-300"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                  {brief.category}
                </p>
                <h3 className="font-sans text-xl font-medium text-brand-dark leading-snug mb-4">
                  {brief.title}
                </h3>
                <p className="font-sans text-[14px] text-brand-gray leading-relaxed">
                  {brief.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3Ai Convenings */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Convenings
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark mb-8">
                Triple Ai (3Ai)
              </h2>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-6">
                The Africa Alliance for Artificial Intelligence convenes a select
                group of leaders in AI, technology, African governance, and
                international finance. Designed to embody Rimsom&apos;s ethos of
                mastery in motion and meaningful collaboration, 3Ai serves as both a
                model and a proof of concept: intimate, effective, and deeply aligned
                with the firm&apos;s purpose.
              </p>
              <p className="font-sans text-[15px] text-brand-gray leading-relaxed">
                Rimsom&apos;s events are designed to convene decision-makers with
                purpose, not to create publicity. They produce real outcomes while
                generating selective insights that enrich our thought-leadership
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 md:py-28 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
              Stay Informed
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-8">
              Stay informed with the Rimsom Dispatch.
            </h2>
            <p className="font-sans text-[15px] text-white/50 leading-relaxed mb-10">
              Receive measured analysis and intelligence on global trade,
              development finance, and emerging market opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold hover:bg-brand-gold-light transition-colors duration-200"
            >
              Request Access
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
