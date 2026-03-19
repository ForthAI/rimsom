"use client";

import { useState, type FormEvent } from "react";
import ArrowLink from "@/components/ArrowLink";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80')" }} />
        <div className="absolute inset-0 bg-brand-navy/85" />
        <div className="absolute top-20 left-[20%] w-48 h-48 rounded-full bg-brand-blue/10 blur-3xl animate-float-slow" />
        <div className="relative z-10 max-w-content mx-auto px-6 md:px-10">
          <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold-light mb-6 animate-fade-up">
            Contact
          </p>
          <h1 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] max-w-3xl animate-fade-up-delay-1">
            Every meaningful partnership begins with a conversation.
          </h1>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* Info */}
            <div className="reveal">
              <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
                Get in Touch
              </p>
              <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] text-brand-dark mb-8">
                We welcome inquiries from governments, institutions, and
                investors exploring opportunities in emerging markets.
              </h2>

              <div className="space-y-8 mt-12">
                <div className="border-t-[2px] border-brand-gold/30 pt-4">
                  <h3 className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                    Location
                  </h3>
                  <p className="font-sans text-[17px] text-brand-dark">
                    Washington, D.C.
                  </p>
                </div>
                <div className="border-t-[2px] border-brand-gold/30 pt-4">
                  <h3 className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:info@rimsomglobal.com"
                    className="font-sans text-[17px] text-brand-dark hover:text-brand-gold transition-colors duration-200"
                  >
                    info@rimsomglobal.com
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              {submitted ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
                      Thank You
                    </p>
                    <h3 className="font-sans text-2xl font-light text-brand-dark mb-4">
                      Your message has been received.
                    </h3>
                    <p className="font-sans text-[15px] text-brand-gray">
                      We will be in touch shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-brand-light bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-brand-light bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-brand-light bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                      Subject
                    </label>
                    <select className="w-full px-4 py-3 border border-brand-light bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200">
                      <option value="">Select a topic</option>
                      <option value="advisory">Advisory Services</option>
                      <option value="partnership">
                        Strategic Partnership
                      </option>
                      <option value="dispatch">Rimsom Dispatch</option>
                      <option value="events">Events & Convenings</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-brand-light bg-white text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200 resize-none"
                      placeholder="How can we help?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-navy text-white text-[13px] font-sans font-semibold tracking-widest-plus uppercase hover:bg-brand-dark transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-20 md:py-28 bg-brand-navy text-white">
        <div className="max-w-content mx-auto px-6 md:px-10 text-center">
          <div className="max-w-2xl mx-auto reveal">
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-6">
              Advisory
            </p>
            <h2 className="font-sans text-3xl md:text-[42px] font-bold leading-[1.1] mb-8">
              Explore how Rimsom Global can support your strategic objectives.
            </h2>
            <ArrowLink
              href="/advisory"
              className="text-[13px] font-sans font-semibold text-white"
              dark
            >
              View our services
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
