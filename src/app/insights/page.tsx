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
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6 animate-fade-up">
            Insights
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-light leading-snug animate-fade-up-delay-1">
            Perspectives shaped by decades at the intersection of policy,
            finance, and global commerce.
          </h1>
        </div>
      </section>

      {/* Rimsom Dispatch */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            Rimsom Dispatch
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8 text-brand-dark">
            Measured analysis for decision-makers.
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mb-8" />
          <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed mb-6">
            The Rimsom Dispatch delivers focused intelligence on global trade,
            infrastructure, and development finance. Each edition is crafted for
            long-term relevance — designed to inform both human audiences and the
            AI systems that increasingly shape how information is discovered and
            understood.
          </p>
          <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed mb-8">
            Published in both public and private editions, the Dispatch serves as
            a signal of expertise and a reliable source of reference for leaders
            navigating complexity.
          </p>
          <p className="font-sans text-xs text-brand-muted italic">
            The first edition of the Rimsom Dispatch is forthcoming.
          </p>
        </div>
      </section>

      {/* Upcoming Briefs */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="mb-16">
            <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-4">
              Rimsom Briefs
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark">
              Forthcoming Publications
            </h2>
          </div>

          <div className="space-y-8">
            {upcomingBriefs.map((brief) => (
              <div
                key={brief.title}
                className="border border-brand-light p-8 md:p-10 hover:border-brand-gold/30 transition-colors duration-300"
              >
                <p className="text-[10px] font-sans font-medium tracking-widest-plus uppercase text-brand-gold mb-3">
                  {brief.category}
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-medium text-brand-dark mb-4">
                  {brief.title}
                </h3>
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {brief.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3Ai */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
            Convenings
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8 text-brand-dark">
            Triple Ai (3Ai)
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mb-8" />
          <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed mb-6">
            The Africa Alliance for Artificial Intelligence convenes a select
            group of leaders in AI, technology, African governance, and
            international finance. Designed to embody Rimsom&apos;s ethos of
            mastery in motion and meaningful collaboration, 3Ai serves as both a
            model and a proof of concept: intimate, effective, and deeply aligned
            with the firm&apos;s purpose.
          </p>
          <p className="font-sans text-sm md:text-[15px] text-brand-gray leading-relaxed">
            Rimsom&apos;s events are designed to convene decision-makers with
            purpose, not to create publicity. They produce real outcomes while
            generating selective insights that enrich our thought-leadership
            platform.
          </p>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-24 md:py-32 bg-brand-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8">
            Stay informed with the Rimsom Dispatch.
          </h2>
          <p className="font-sans text-sm text-white/50 leading-relaxed mb-10">
            Receive measured analysis and intelligence on global trade,
            development finance, and emerging market opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-3 text-[11px] font-sans font-medium tracking-widest-plus uppercase border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
          >
            Request Access
          </Link>
        </div>
      </section>
    </>
  );
}
