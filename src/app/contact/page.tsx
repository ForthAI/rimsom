"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6 animate-fade-up">
            Contact
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-light leading-snug animate-fade-up-delay-1">
            Every meaningful partnership begins with a conversation.
          </h1>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 md:py-32 bg-brand-cream">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* Info */}
            <div>
              <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-6">
                Get in Touch
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug mb-8 text-brand-dark">
                We welcome inquiries from governments, institutions, and
                investors exploring opportunities in emerging markets.
              </h2>
              <div className="w-12 h-[1px] bg-brand-gold mb-8" />

              <div className="space-y-6">
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-brand-muted mb-2">
                    Location
                  </h3>
                  <p className="font-sans text-sm text-brand-dark">
                    Washington, D.C.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-brand-muted mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:info@rimsomglobal.com"
                    className="font-sans text-sm text-brand-dark hover:text-brand-gold transition-colors duration-200"
                  >
                    info@rimsomglobal.com
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-[10px] font-sans font-medium tracking-ultra uppercase text-brand-gold mb-4">
                      Thank You
                    </p>
                    <h3 className="font-serif text-xl font-light text-brand-dark mb-4">
                      Your message has been received.
                    </h3>
                    <p className="font-sans text-sm text-brand-gray">
                      We will be in touch shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-sans font-medium tracking-widest uppercase text-brand-muted mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white border border-brand-light text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-medium tracking-widest uppercase text-brand-muted mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white border border-brand-light text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-medium tracking-widest uppercase text-brand-muted mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-brand-light text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-medium tracking-widest uppercase text-brand-muted mb-2">
                      Subject
                    </label>
                    <select className="w-full px-4 py-3 bg-white border border-brand-light text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200">
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
                    <label className="block text-[10px] font-sans font-medium tracking-widest uppercase text-brand-muted mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-brand-light text-sm text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200 resize-none"
                      placeholder="How can we help?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-dark text-white text-[11px] font-sans font-medium tracking-widest-plus uppercase hover:bg-brand-charcoal transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
