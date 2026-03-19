"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/advisory", label: "Advisory" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-light/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-serif text-xl md:text-2xl font-semibold tracking-wide text-brand-dark">
            RIMSOM
          </span>
          <span className="hidden sm:inline text-[10px] font-sans font-medium tracking-widest-plus uppercase text-brand-muted">
            Global
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-sans font-medium tracking-widest-plus uppercase transition-colors duration-200 ${
                  isActive
                    ? "text-brand-dark"
                    : "text-brand-gray hover:text-brand-dark"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="block mt-1 h-[1px] bg-brand-gold w-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span
            className={`block w-5 h-[1.5px] bg-brand-dark transition-transform duration-200 ${
              mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-brand-dark transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-brand-dark transition-transform duration-200 ${
              mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-brand-cream border-t border-brand-light/60 px-6 py-6 space-y-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-[12px] font-sans font-medium tracking-widest-plus uppercase ${
                  isActive ? "text-brand-dark" : "text-brand-gray"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
