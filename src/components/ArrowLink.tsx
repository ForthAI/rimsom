import Link from "next/link";

export default function ArrowLink({
  href,
  children,
  className = "",
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`arrow-link group inline-flex items-center gap-3 ${className}`}
    >
      <span>{children}</span>
      <svg
        className={`arrow-icon w-5 h-5 flex-shrink-0 ${
          dark ? "text-white" : "text-brand-gold"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
