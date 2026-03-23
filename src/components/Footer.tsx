"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12 md:py-14">
        {/* Top row — logo + nav */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Rimsom Global"
              width={140}
              height={44}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <nav className="flex flex-wrap items-center gap-6 md:gap-8">
            {[
              { href: "/about", label: "About" },
              { href: "/advisory", label: "Advisory" },
              { href: "/circle", label: "The Circle" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </nav>
        </div>

        {/* Bottom row — copyright + legal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6">
          <span className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} Rimsom Global. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            {[
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
              { href: "/legal", label: "Legal" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] text-white/25 hover:text-white/50 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
