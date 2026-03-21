"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/advisory", label: "Advisory" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // On homepage, stay transparent until the overlapping section reaches the header
      const headerH = 72;
      const threshold = pathname === "/" ? window.innerHeight - headerH : 20;
      setScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // All pages have dark hero backgrounds
  const isDarkHero = true;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-sm"
            : isDarkHero
            ? "bg-transparent"
            : "bg-white"
        }`}
      >
        <div className="max-w-content mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-[72px]">
          {/* Hamburger */}
          <button
            className="flex flex-col justify-center gap-[5px] w-8 h-8 mr-6"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span
              className={`block w-5 h-[1.5px] transition-all duration-200 ${
                mobileOpen
                  ? `rotate-45 translate-y-[6.5px] ${
                      scrolled || !isDarkHero ? "bg-brand-dark" : "bg-white"
                    }`
                  : scrolled || !isDarkHero
                  ? "bg-brand-dark"
                  : "bg-white"
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] transition-all duration-200 ${
                mobileOpen
                  ? "opacity-0"
                  : scrolled || !isDarkHero
                  ? "bg-brand-dark"
                  : "bg-white"
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] transition-all duration-200 ${
                mobileOpen
                  ? `-rotate-45 -translate-y-[6.5px] ${
                      scrolled || !isDarkHero ? "bg-brand-dark" : "bg-white"
                    }`
                  : scrolled || !isDarkHero
                  ? "bg-brand-dark"
                  : "bg-white"
              }`}
            />
          </button>

          {/* Logo */}
          <Link href="/" className="mr-auto">
            <Image
              src={
                scrolled || !isDarkHero ? "/logo.svg" : "/logo-white.svg"
              }
              alt="Rimsom Global"
              width={160}
              height={50}
              className="h-10 md:h-12 w-auto transition-opacity duration-200"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] font-sans font-medium transition-colors duration-200 ${
                    scrolled || !isDarkHero
                      ? isActive
                        ? "text-brand-dark"
                        : "text-brand-gray hover:text-brand-dark"
                      : isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-brand-navy transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <nav className="flex flex-col items-center gap-8">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-white/50 text-sm font-sans font-medium hover:text-white transition-colors"
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white text-2xl font-sans font-light hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
