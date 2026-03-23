"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center bg-brand-navy text-white px-6">
      <div className="w-full max-w-md">
        {/* Circle branding */}
        <div className="flex items-center gap-3 mb-10">
          <svg className="w-10 h-10" viewBox="0 0 84.2 116.16" xmlns="http://www.w3.org/2000/svg">
            <g fill="#a8843a">
              <path d="M25,77.17c-7.52-6.77-10.61-17.67-6.93-27.76,3.67-10.09,13.04-16.46,23.16-16.81l5.91-16.23C28.14,14.06,9.37,25,2.55,43.75c-6.82,18.75.52,39.19,16.55,49.64l5.91-16.23Z"/>
              <path d="M65.15,22.94l-5.91,16.23c7.49,6.77,10.55,17.65,6.89,27.72-3.67,10.07-13,16.44-23.1,16.81l-5.91,16.23c18.97,2.27,37.71-8.66,44.53-27.4,6.82-18.73-.5-39.15-16.5-49.61Z"/>
              <path d="M50.85,34.12c2.49.9,4.75,2.15,6.75,3.68l10.06-27.63c1.43-3.93-.6-8.28-4.53-9.71-3.93-1.43-8.28.6-9.71,4.53l-10.05,27.61c2.49.12,5.01.62,7.48,1.52Z"/>
              <path d="M33.35,82.18c-2.47-.9-4.72-2.14-6.71-3.65l-10,27.46c-1.43,3.93.6,8.28,4.53,9.71,3.93,1.43,8.28-.6,9.71-4.53l10-27.48c-2.51-.12-5.04-.62-7.53-1.52Z"/>
            </g>
          </svg>
          <p className="text-[13px] font-sans font-semibold tracking-widest uppercase text-brand-gold">
            The Rimsom Circle
          </p>
        </div>

        {!submitted ? (
          <>
            <h1 className="font-sans text-3xl md:text-[38px] font-bold leading-[1.1] mb-4">
              Welcome back.
            </h1>
            <p className="font-sans text-[15px] text-white/50 leading-relaxed mb-10">
              Enter your email to access the full Rimsom Circle — articles,
              podcasts, video, and the Rimsom Dispatch.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
            >
              <label className="block text-[11px] font-sans font-semibold tracking-wider uppercase text-white/40 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-white/30 text-[15px] font-sans outline-none focus:border-brand-gold transition-colors mb-6"
                required
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold tracking-wider uppercase rounded-sm hover:bg-brand-gold-light transition-colors"
              >
                Continue
              </button>
            </form>

            <p className="text-[12px] font-sans text-white/30 mt-8 text-center">
              Access is reserved for members of the Rimsom network.
              <br />
              <Link
                href="/contact"
                className="text-brand-gold/70 hover:text-brand-gold transition-colors"
              >
                Request an invitation
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-brand-gold/30 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
                strokeWidth="1.5"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 className="font-sans text-2xl font-bold mb-4">
              Check your inbox.
            </h2>
            <p className="font-sans text-[15px] text-white/50 leading-relaxed mb-2">
              We sent a login link to{" "}
              <span className="text-white font-medium">{email}</span>
            </p>
            <p className="font-sans text-[13px] text-white/30">
              Click the link in the email to access the Rimsom Circle.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 text-[12px] font-sans text-brand-gold/60 hover:text-brand-gold transition-colors"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
