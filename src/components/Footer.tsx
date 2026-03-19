import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-semibold tracking-wide mb-4">
              RIMSOM
            </h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Trusted relationships that shape global outcomes.
            </p>
            <p className="text-xs text-white/30 mt-2 tracking-wide">
              Capital &middot; Leadership &middot; Legacy
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-sans font-medium tracking-widest-plus uppercase text-white/40 mb-6">
              Navigation
            </h4>
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
                  className="block text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-sans font-medium tracking-widest-plus uppercase text-white/40 mb-6">
              Contact
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Washington, D.C.
            </p>
            <a
              href="mailto:info@rimsomglobal.com"
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 mt-2 block"
            >
              info@rimsomglobal.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Rimsom Global. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
