import Image from "next/image";
import Link from "next/link";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header — just the logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-content mx-auto px-6 md:px-10 py-5">
          <Link href="/">
            <Image
              src="/logo-white.svg"
              alt="Rimsom Global"
              width={120}
              height={38}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
