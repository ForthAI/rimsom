import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Rimsom Global",
};

export default function TermsPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <h1 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1]">
            Terms of Use
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="prose prose-gray font-sans text-[15px] text-brand-gray leading-relaxed space-y-6">
            <p className="text-brand-muted text-[13px]">
              Effective Date: March 2026
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Rimsom Global website
              (&quot;rimsomglobal.com&quot;), you agree to be bound by these
              Terms of Use. If you do not agree, please do not use this site.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              2. Use of Site
            </h2>
            <p>
              This website is provided for informational purposes only. The
              content on this site does not constitute professional advice —
              financial, legal, or otherwise. Rimsom Global reserves the right
              to modify or discontinue the site at any time without notice.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              3. Intellectual Property
            </h2>
            <p>
              All content, trademarks, logos, and intellectual property
              displayed on this site are owned by Rimsom Global or its
              licensors. You may not reproduce, distribute, or create
              derivative works without prior written consent.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              4. Limitation of Liability
            </h2>
            <p>
              Rimsom Global shall not be liable for any damages arising from
              your use of or inability to use this site. All content is
              provided &quot;as is&quot; without warranties of any kind.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              5. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the District of Columbia,
              United States.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              6. Contact
            </h2>
            <p>
              For questions regarding these terms, contact us at{" "}
              <a
                href="mailto:info@rimsomglobal.com"
                className="text-brand-gold hover:underline"
              >
                info@rimsomglobal.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
