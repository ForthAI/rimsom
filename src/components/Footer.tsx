"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-content mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-10">
        {/* Top row — logo + nav columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-10 md:gap-8 pb-14 border-b border-white/10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.svg"
              alt="Rimsom Global"
              width={160}
              height={50}
              className="h-10 w-auto mb-5 brightness-0 invert"
            />
            <p className="text-[13px] text-white/40 leading-relaxed max-w-xs">
              Trusted relationships that shape global outcomes.
            </p>
          </div>

          {/* Firm */}
          <nav>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
              Firm
            </p>
            <div className="space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/advisory", label: "Advisory" },
                { href: "/circle", label: "The Circle" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-[13px] text-white/60 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Connect */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
              Connect
            </p>
            <div className="space-y-3">
              <p className="text-[13px] text-white/60">Washington, D.C.</p>
              <Link
                href="/contact"
                className="block text-[13px] text-white/60 hover:text-white transition-colors duration-200"
              >
                Contact Us
              </Link>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] text-white/60 hover:text-white transition-colors duration-200"
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

          {/* Legal */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
              Legal
            </p>
            <div className="space-y-3">
              <Link
                href="/terms"
                className="block text-[13px] text-white/60 hover:text-white transition-colors duration-200"
              >
                Terms of Use
              </Link>
              <Link
                href="/privacy"
                className="block text-[13px] text-white/60 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal"
                className="block text-[13px] text-white/60 hover:text-white transition-colors duration-200"
              >
                Legal Disclosures
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} Rimsom Global. All rights
            reserved.
          </span>
          <span className="text-[11px] text-white/25 tracking-wider">
            Capital &middot; Leadership &middot; Legacy
          </span>
        </div>
      </div>
    </footer>
  );
}
