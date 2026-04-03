"use client";

import { useState } from "react";
import { EventConfig } from "@/types/events";

type Phase = "email" | "form" | "submitting" | "success" | "already-registered";

export default function RsvpForm({ event }: { event: EventConfig }) {
  const [phase, setPhase] = useState<Phase>("email");
  const [email, setEmail] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/events/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug: event.slug, email }),
      });
      const data = await res.json();

      if (data.alreadyRegistered) {
        setPhase("already-registered");
      } else if (data.valid) {
        setFields({ email });
        setPhase("form");
      } else {
        setError(data.message || "We weren't able to find that email. Please make sure you're using the email address your invitation was sent to.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.attending) {
      setError("Please indicate whether you will attend.");
      return;
    }
    setError("");
    setPhase("submitting");

    try {
      const res = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug: event.slug, email, fields }),
      });
      const data = await res.json();

      if (data.success) {
        setPhase("success");
      } else {
        setError(data.message || "Something went wrong.");
        setPhase("form");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("form");
    }
  };

  const updateField = (name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  // Success state
  if (phase === "success") {
    const declined = fields.attending === "No";
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full border-2 border-brand-gold flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-sans text-2xl font-bold text-brand-dark">
            {declined ? "Response Received" : event.confirmationHeadline}
          </h3>
        </div>
        <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-8">
          {declined
            ? "Thank you for letting us know. We hope to see you at a future event."
            : event.confirmationText}
        </p>
        {!declined && <div className="p-6 bg-brand-offwhite rounded-lg border border-brand-light">
          <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-gold mb-4">
            Event Location
          </p>
          <p className="font-sans text-[15px] font-semibold text-brand-dark mb-1">
            {event.venueAddress}
          </p>
          <p className="font-sans text-[14px] text-brand-gray mb-3">
            {event.date} &middot; {event.time}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venueAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-[13px] font-sans font-semibold text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            View on Google Maps
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>}
      </div>
    );
  }

  // Already registered
  if (phase === "already-registered") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full border-2 border-brand-gold flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-sans text-2xl font-bold text-brand-dark">
            Already Registered
          </h3>
        </div>
        <p className="font-sans text-[15px] text-brand-gray leading-relaxed mb-6">
          You have already RSVP&apos;d for this event. A confirmation was sent to <strong>{email}</strong>.
        </p>
        <p className="font-sans text-[14px] text-brand-gray">
          If you need to make changes, please contact{" "}
          <a href="mailto:events@rimsomglobal.com" className="text-brand-gold hover:text-brand-gold-light transition-colors">
            events@rimsomglobal.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-sans text-2xl md:text-[30px] font-bold leading-[1.15] text-brand-dark mb-6">
        Please RSVP
      </h2>

      {error && (
        <div className="mb-6 p-4 border-l-2 border-red-500 bg-red-50">
          <p className="font-sans text-[14px] text-red-700">{error}</p>
        </div>
      )}

      {/* Phase 1: Email */}
      {phase === "email" && (
        <form onSubmit={handleEmailSubmit}>
          <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter the email your invitation was sent to"
            required
            className="w-full px-4 py-3.5 border border-brand-light bg-white text-[14px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200 mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold tracking-wider uppercase hover:bg-brand-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      )}

      {/* Phase 2: Full form */}
      {(phase === "form" || phase === "submitting") && (
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Email (read-only) */}
          <div>
            <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3.5 border border-brand-light bg-brand-offwhite text-[14px] text-brand-gray font-sans outline-none cursor-not-allowed"
            />
          </div>

          {/* Will you attend? */}
          <div>
            <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-3">
              Will you attend? <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="flex gap-3">
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateField("attending", opt)}
                  className={`flex-1 py-3 text-[14px] font-sans font-medium border transition-all duration-200 ${
                    fields.attending === opt
                      ? "border-brand-gold bg-brand-gold/10 text-brand-dark"
                      : "border-brand-light text-brand-gray hover:border-brand-dark"
                  }`}
                >
                  {opt === "Yes" ? "Yes, I'll be there" : "No, I can't make it"}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic fields — only show if attending */}
          {fields.attending !== "No" && event.formFields
            .filter((f) => f.name !== "email")
            .map((field) => (
              <div key={field.name}>
                <label className="block text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-brand-muted mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    value={fields[field.name] || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    required={field.required}
                    className="w-full px-4 py-3.5 border border-brand-light bg-white text-[14px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={fields[field.name] || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={3}
                    className="w-full px-4 py-3.5 border border-brand-light bg-white text-[14px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200 resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={fields[field.name] || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-3.5 border border-brand-light bg-white text-[14px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200"
                  />
                )}
              </div>
            ))}

          <button
            type="submit"
            disabled={phase === "submitting"}
            className="w-full py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold tracking-wider uppercase hover:bg-brand-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {phase === "submitting" ? "Submitting..." : "Confirm RSVP"}
          </button>
        </form>
      )}
    </div>
  );
}
