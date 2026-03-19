"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-offwhite border-t border-brand-light">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-12 md:gap-16">
          {/* Brand */}
          <div>
            <Image
              src="/logo.svg"
              alt="Rimsom Global"
              width={160}
              height={50}
              className="h-10 w-auto mb-6"
            />
            <p className="text-[13px] text-brand-gray leading-relaxed max-w-xs">
              Trusted relationships that shape global outcomes.
            </p>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-8">
            <nav className="space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/advisory", label: "Advisory" },
                { href: "/insights", label: "Insights" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-[14px] text-brand-dark hover:text-brand-gold transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-3">
              <p className="text-[14px] text-brand-dark">Washington, D.C.</p>
              <a
                href="mailto:info@rimsomglobal.com"
                className="block text-[14px] text-brand-dark hover:text-brand-gold transition-colors duration-200"
              >
                info@rimsomglobal.com
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] text-brand-dark hover:text-brand-gold transition-colors duration-200 mt-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-[15px] font-sans font-semibold text-brand-dark mb-2">
              Subscribe
            </h4>
            <p className="text-[13px] text-brand-gray mb-4">
              Receive the Rimsom Dispatch — insights on global trade,
              development finance, and emerging markets.
            </p>
            <form
              className="flex gap-0"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 border border-brand-light bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand-navy text-white text-[13px] font-sans font-semibold hover:bg-brand-navy-deep transition-colors duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div className="mt-14 pt-6 border-t border-brand-light flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-xs text-brand-muted">
              &copy; {new Date().getFullYear()} Rimsom Global. All rights
              reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-brand-muted">
              Capital &middot; Leadership &middot; Legacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
