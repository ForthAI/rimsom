import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Rimsom Global",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <h1 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1]">
            Privacy Policy
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
              1. Information We Collect
            </h2>
            <p>
              We may collect personal information you voluntarily provide, such
              as your name and email address when you subscribe to the Rimsom
              Circle or use our contact form. We also collect standard
              analytics data (page views, referral sources) through cookies and
              similar technologies.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              2. How We Use Your Information
            </h2>
            <p>
              Personal information is used to deliver requested content (such
              as the Rimsom Dispatch), respond to inquiries, and improve our
              services. We do not sell or share your personal information with
              third parties for marketing purposes.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              3. Data Security
            </h2>
            <p>
              We implement reasonable security measures to protect your
              information. However, no method of transmission over the internet
              is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              4. Cookies
            </h2>
            <p>
              This site uses cookies to enhance your experience and collect
              analytics data. You may disable cookies in your browser settings,
              though some features may not function properly.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              5. Your Rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal information at any time by contacting us at{" "}
              <a
                href="mailto:info@rimsomglobal.com"
                className="text-brand-gold hover:underline"
              >
                info@rimsomglobal.com
              </a>
              .
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Changes will be
              posted on this page with an updated effective date.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
