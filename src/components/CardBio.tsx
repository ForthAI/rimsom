"use client";

import { useState } from "react";

interface Props {
  teaser: string;
  /** Full bio; `\n\n` separates paragraphs. */
  bio: string;
}

/**
 * Collapsed by default, expands to reveal the full bio.
 * Sits between the identity block and the contact actions on
 * a /card/[slug] page — small enough to not push contact buttons
 * below the fold, but there for anyone curious.
 */
export function CardBio({ teaser, bio }: Props) {
  const [open, setOpen] = useState(false);
  const paragraphs = bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-1 py-3 text-left border-t border-b border-white/10 hover:border-white/25 transition-colors"
      >
        <span className="text-[13px] font-sans text-white/70 leading-snug italic pr-2">
          &ldquo;{teaser}&rdquo;
        </span>
        <svg
          className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="pt-4 pb-2 space-y-3">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-[13px] font-sans text-white/65 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
