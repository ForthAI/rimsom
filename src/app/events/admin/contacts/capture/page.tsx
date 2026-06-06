"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ContactInput } from "@/lib/contacts";
import { Contact, CONTACT_STATUSES, HONORIFICS } from "@/types/contacts";

type Stage = "idle" | "preparing" | "uploading" | "extracting" | "review" | "saving" | "saved" | "error";

interface DuplicateInfo {
  rowIndex: number;
  firstName: string;
  surname: string;
  email: string;
}

export default function CapturePage() {
  // Auth gate (same pattern as the rest of the admin).
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ContactInput | null>(null);
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Probe auth on mount by hitting a protected endpoint.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/contacts");
        if (res.ok) setAuthenticated(true);
      } catch {
        // not authenticated
      }
    })();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/events/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setAuthError(d.message || "Invalid password.");
      } else {
        setPassword("");
        setAuthenticated(true);
      }
    } catch {
      setAuthError("Something went wrong.");
    } finally {
      setAuthLoading(false);
    }
  }

  /**
   * Resize the original capture down to ~1024px wide before upload.
   * Saves bandwidth (cellular intern!) and gets a faster Claude call.
   * Returns a Blob in the same image type as the input.
   */
  const resizeImage = useCallback(async (file: File): Promise<Blob> => {
    const MAX_WIDTH = 1280;
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, MAX_WIDTH / bitmap.width);
    const w = Math.round(bitmap.width * ratio);
    const h = Math.round(bitmap.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(bitmap, 0, 0, w, h);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Could not encode image"))),
        // Re-encode as JPEG even if original was HEIC — Claude doesn't accept HEIC.
        "image/jpeg",
        0.88
      );
    });
  }, []);

  async function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg("");
    setExtracted(null);
    setDuplicate(null);
    setStage("preparing");
    try {
      // Local preview right away
      setLocalPreview(URL.createObjectURL(file));

      const resized = await resizeImage(file);
      setStage("uploading");

      const form = new FormData();
      form.append("image", resized, "card.jpg");

      const res = await fetch("/api/admin/contacts/capture", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Capture failed.");
      }
      const data = await res.json();
      setPhotoUrl(data.photoUrl || null);
      setExtracted(data.extracted as ContactInput);
      setDuplicate(data.duplicate || null);
      setStage("review");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed.");
      setStage("error");
    }
  }

  function updateField<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setExtracted((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!extracted) return;
    setStage("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extracted),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setSavedCount((c) => c + 1);
      setStage("saved");
      // Brief success state, then reset for the next card.
      setTimeout(() => resetForNext(), 1200);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Save failed.");
      setStage("review");
    }
  }

  async function handleUpdateExisting(c: Contact | DuplicateInfo) {
    if (!extracted) return;
    setStage("saving");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/admin/contacts/${c.rowIndex}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...extracted,
          // Required by the PATCH guard.
          priorEmail: "email" in c ? c.email : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setSavedCount((c) => c + 1);
      setStage("saved");
      setTimeout(() => resetForNext(), 1200);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Update failed.");
      setStage("review");
    }
  }

  function resetForNext() {
    setStage("idle");
    setErrorMsg("");
    setLocalPreview(null);
    setPhotoUrl(null);
    setExtracted(null);
    setDuplicate(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <h1 className="text-white text-center font-sans text-[16px] font-semibold mb-6">
            Quick Capture
          </h1>
          {authError && (
            <p className="mb-3 text-red-300 font-sans text-[13px]">{authError}</p>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            required
            className="w-full px-4 py-3 mb-3 bg-white/10 border border-white/20 text-white font-sans text-[14px] outline-none rounded"
          />
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 bg-brand-gold text-white font-sans text-[13px] font-semibold uppercase tracking-wider rounded disabled:opacity-50"
          >
            {authLoading ? "Authenticating..." : "Log In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-black text-white">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/events/admin/contacts" className="text-[12px] font-sans text-white/70 hover:text-white">
            ← Contacts
          </Link>
          <span className="text-[11px] font-sans font-semibold tracking-wider uppercase">
            Quick Capture
          </span>
          <span className="text-[12px] font-sans text-white/70 tabular-nums">
            {savedCount > 0 ? `${savedCount} saved` : ""}
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-4">
        {/* Capture button / file input */}
        {(stage === "idle" || stage === "error") && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center space-y-3">
            <p className="font-sans text-[13px] text-gray-600">
              Take a photo of the business card. AI will extract the details for you to review.
            </p>
            {errorMsg && (
              <div className="p-2 border-l-2 border-red-500 bg-red-50 text-[12px] font-sans text-red-700 text-left">
                {errorMsg}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChosen}
              className="hidden"
              id="card-photo-input"
            />
            <label
              htmlFor="card-photo-input"
              className="inline-block w-full px-6 py-4 bg-gray-900 text-white font-sans text-[14px] font-semibold tracking-wider uppercase rounded cursor-pointer"
            >
              📷 Photograph Card
            </label>
            <p className="text-[10px] font-sans text-gray-400">
              Camera opens directly on phones. Existing photos work too.
            </p>
          </div>
        )}

        {/* In-flight states */}
        {(stage === "preparing" || stage === "uploading" || stage === "extracting") && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            {localPreview && (
              <img
                src={localPreview}
                alt="Captured card"
                className="w-full rounded mb-4 max-h-[40vh] object-contain"
              />
            )}
            <p className="font-sans text-[13px] text-gray-700">
              {stage === "preparing" && "Preparing image…"}
              {stage === "uploading" && "Uploading…"}
              {stage === "extracting" && "Extracting contact info…"}
            </p>
          </div>
        )}

        {/* Review */}
        {stage === "review" && extracted && (
          <div className="space-y-3">
            {/* Photo preview */}
            {(photoUrl || localPreview) && (
              <div className="bg-white border border-gray-200 rounded-lg p-2">
                <img
                  src={photoUrl || localPreview || ""}
                  alt="Captured card"
                  className="w-full rounded max-h-[35vh] object-contain"
                />
              </div>
            )}

            {/* Duplicate notice */}
            {duplicate && (
              <div className="bg-amber-50 border-l-2 border-amber-400 p-3 rounded-r text-[12px] font-sans text-gray-800">
                <p className="mb-2">
                  <strong>Already in contacts:</strong>{" "}
                  {[duplicate.firstName, duplicate.surname].filter(Boolean).join(" ") || duplicate.email}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateExisting(duplicate)}
                    className="px-3 py-1.5 bg-amber-700 text-white text-[11px] font-sans font-semibold tracking-wider uppercase rounded"
                  >
                    Update existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuplicate(null)}
                    className="px-3 py-1.5 text-gray-700 text-[11px] font-sans hover:text-gray-900"
                  >
                    Save as new anyway
                  </button>
                </div>
              </div>
            )}

            {/* Editable extracted data */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              {errorMsg && (
                <div className="p-2 border-l-2 border-red-500 bg-red-50 text-[12px] font-sans text-red-700">
                  {errorMsg}
                </div>
              )}

              <FieldRow label="Email">
                <input
                  type="email"
                  value={extracted.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={fieldCls}
                />
              </FieldRow>

              <div className="grid grid-cols-2 gap-2">
                <FieldRow label="Honorific">
                  <select
                    value={extracted.honorific}
                    onChange={(e) => updateField("honorific", e.target.value)}
                    className={fieldCls}
                  >
                    {HONORIFICS.map((h) => (
                      <option key={h} value={h}>
                        {h || "—"}
                      </option>
                    ))}
                  </select>
                </FieldRow>
                <FieldRow label="Status">
                  <select
                    value={extracted.status}
                    onChange={(e) =>
                      updateField("status", e.target.value as ContactInput["status"])
                    }
                    className={fieldCls}
                  >
                    {CONTACT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FieldRow>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FieldRow label="First">
                  <input
                    type="text"
                    value={extracted.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className={fieldCls}
                  />
                </FieldRow>
                <FieldRow label="Surname">
                  <input
                    type="text"
                    value={extracted.surname}
                    onChange={(e) => updateField("surname", e.target.value)}
                    className={fieldCls}
                  />
                </FieldRow>
              </div>

              <FieldRow label="Title">
                <input
                  type="text"
                  value={extracted.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={fieldCls}
                />
              </FieldRow>

              <FieldRow label="Organization">
                <input
                  type="text"
                  value={extracted.organization}
                  onChange={(e) => updateField("organization", e.target.value)}
                  className={fieldCls}
                />
              </FieldRow>

              <div className="grid grid-cols-3 gap-2">
                <FieldRow label="+">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={extracted.phoneCountry}
                    onChange={(e) =>
                      updateField("phoneCountry", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="1"
                    className={fieldCls}
                  />
                </FieldRow>
                <div className="col-span-2">
                  <FieldRow label="Phone">
                    <input
                      type="text"
                      value={extracted.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={fieldCls}
                    />
                  </FieldRow>
                </div>
              </div>

              <FieldRow label="LinkedIn">
                <input
                  type="text"
                  value={extracted.linkedin}
                  onChange={(e) => updateField("linkedin", e.target.value)}
                  className={fieldCls}
                />
              </FieldRow>

              <FieldRow label="Website">
                <input
                  type="text"
                  value={extracted.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  className={fieldCls}
                />
              </FieldRow>

              {/* Address (collapsed by default — open with a button to reduce scrolling) */}
              <AddressBlock extracted={extracted} updateField={updateField} />

              <FieldRow label="Notes">
                <textarea
                  value={extracted.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={2}
                  className={fieldCls}
                />
              </FieldRow>
            </div>

            {/* Action buttons */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sticky bottom-2 shadow-lg">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForNext}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-sans text-[13px] font-semibold rounded"
                >
                  Discard
                </button>
                {!duplicate && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-[2] py-3 bg-gray-900 text-white font-sans text-[13px] font-semibold tracking-wider uppercase rounded"
                  >
                    Save & Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Saved success */}
        {stage === "saving" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <p className="font-sans text-[13px] text-gray-700">Saving…</p>
          </div>
        )}
        {stage === "saved" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="font-sans text-[14px] text-green-800 font-semibold">✓ Saved</p>
            <p className="font-sans text-[12px] text-green-700 mt-1">Ready for the next card.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const fieldCls =
  "w-full px-2.5 py-2 bg-white border border-gray-300 text-[14px] font-sans text-gray-900 outline-none focus:border-gray-900 rounded";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-sans font-semibold tracking-wider uppercase text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function AddressBlock({
  extracted,
  updateField,
}: {
  extracted: ContactInput;
  updateField: <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => void;
}) {
  const hasAny = Boolean(
    extracted.addressLine1 ||
      extracted.addressLine2 ||
      extracted.city ||
      extracted.state ||
      extracted.postalCode ||
      extracted.country
  );
  const [open, setOpen] = useState<boolean>(hasAny);
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] font-sans text-gray-500 hover:text-gray-900 underline"
      >
        + Add address
      </button>
    );
  }
  return (
    <div className="space-y-2 pt-2 border-t border-gray-100">
      <FieldRow label="Street">
        <input
          type="text"
          value={extracted.addressLine1}
          onChange={(e) => updateField("addressLine1", e.target.value)}
          className={fieldCls}
        />
      </FieldRow>
      <div className="grid grid-cols-2 gap-2">
        <FieldRow label="City">
          <input
            type="text"
            value={extracted.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={fieldCls}
          />
        </FieldRow>
        <FieldRow label="State">
          <input
            type="text"
            value={extracted.state}
            onChange={(e) => updateField("state", e.target.value)}
            className={fieldCls}
          />
        </FieldRow>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <FieldRow label="Postal">
          <input
            type="text"
            value={extracted.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            className={fieldCls}
          />
        </FieldRow>
        <FieldRow label="Country">
          <input
            type="text"
            value={extracted.country}
            onChange={(e) => updateField("country", e.target.value)}
            className={fieldCls}
          />
        </FieldRow>
      </div>
    </div>
  );
}
