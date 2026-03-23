import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Disclosures | Rimsom Global",
};

export default function LegalPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <h1 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1]">
            Legal Disclosures
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="prose prose-gray font-sans text-[15px] text-brand-gray leading-relaxed space-y-6">
            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              About Rimsom Global
            </h2>
            <p>
              Rimsom Global is a Washington, D.C.-based advisory firm providing
              business development, strategy, financial advisory, and
              government relations services. The firm is not a registered
              broker-dealer, investment adviser, or law firm.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              No Professional Advice
            </h2>
            <p>
              The information on this website is for general informational
              purposes only and does not constitute financial, legal,
              investment, or other professional advice. Nothing on this site
              should be construed as a recommendation or solicitation to buy,
              sell, or hold any investment or security.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              Forward-Looking Statements
            </h2>
            <p>
              Certain content on this site may contain forward-looking
              statements regarding market conditions, economic trends, or
              business prospects. These statements are based on current
              expectations and are subject to risks and uncertainties. Actual
              results may differ materially.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              Third-Party Links
            </h2>
            <p>
              This website may contain links to third-party sites. Rimsom
              Global does not endorse and is not responsible for the content,
              policies, or practices of any third-party websites.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              Confidentiality
            </h2>
            <p>
              Rimsom Global maintains strict confidentiality regarding client
              engagements, transactions, and relationships. Case studies or
              references on this site are presented with appropriate
              permissions or in sufficiently general terms to protect client
              confidentiality.
            </p>

            <h2 className="font-sans text-xl font-semibold text-brand-dark mt-10 mb-4">
              Contact
            </h2>
            <p>
              For legal inquiries, contact{" "}
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
