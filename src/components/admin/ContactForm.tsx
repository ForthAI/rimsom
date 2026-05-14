"use client";

import { useState, useMemo } from "react";
import { Contact, HONORIFICS } from "@/types/contacts";
import { ContactInput } from "@/lib/contacts";
import { CcOfPicker } from "./CcOfPicker";

interface Props {
  /** When provided, form pre-fills from this contact (edit mode). */
  initial?: Contact;
  onSubmit: (input: ContactInput) => Promise<void>;
  onCancel: () => void;
  /** Show the delete button (edit mode only). */
  onDelete?: () => Promise<void>;
  submitLabel?: string;
  /** Full contacts list — drives the CC Of picker and the Schedulers reverse view. */
  allContacts?: Contact[];
  /** Open another contact in the modal (used by the Schedulers list). */
  onOpenContact?: (c: Contact) => void;
}

function emptyInput(): ContactInput {
  return {
    email: "",
    honorific: "",
    firstName: "",
    surname: "",
    title: "",
    organization: "",
    ccOf: "",
    notes: "",
    lastContacted: "",
    phoneCountry: "",
    phone: "",
    whatsapp: "",
    linkedin: "",
    website: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };
}

function inputFromContact(c: Contact): ContactInput {
  const { rowIndex: _ignored, ...rest } = c;
  void _ignored;
  return { ...rest };
}

const labelCls = "block text-[11px] font-sans font-semibold tracking-wider uppercase text-gray-600 mb-1.5";
const fieldCls =
  "w-full px-3 py-2 bg-white border border-gray-300 text-[13px] font-sans text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 rounded transition-colors";
const sectionCls = "text-[10px] font-sans font-semibold tracking-widest uppercase text-gray-500 pt-2 pb-1 border-b border-gray-200";

export function ContactForm({
  initial,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel = "Save",
  allContacts = [],
  onOpenContact,
}: Props) {
  const [input, setInput] = useState<ContactInput>(initial ? inputFromContact(initial) : emptyInput());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Contacts available to pick as the primary (exclude self).
  const ccOfCandidates = useMemo(
    () => allContacts.filter((c) => !initial || c.email !== initial.email),
    [allContacts, initial]
  );

  // Contacts that CC the current one (reverse lookup). Only meaningful in edit mode.
  const schedulers = useMemo(() => {
    if (!initial?.email) return [];
    return allContacts.filter((c) => c.ccOf === initial.email);
  }, [allContacts, initial]);

  function update<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const email = input.email.toLowerCase().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("A valid email is required.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ ...input, email });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    setError("");
    try {
      await onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 border-l-2 border-red-500 bg-red-50 text-[13px] font-sans text-red-700">
          {error}
        </div>
      )}

      <div className={sectionCls}>Identity</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Email *</label>
          <input
            type="email"
            value={input.email}
            onChange={(e) => update("email", e.target.value)}
            required
            autoFocus={!initial}
            className={fieldCls}
          />
        </div>

        <div>
          <label className={labelCls}>Honorific</label>
          <select
            value={input.honorific}
            onChange={(e) => update("honorific", e.target.value)}
            className={fieldCls}
          >
            {HONORIFICS.map((h) => (
              <option key={h} value={h}>{h || "— None —"}</option>
            ))}
          </select>
        </div>
        <div />

        <div>
          <label className={labelCls}>First Name</label>
          <input
            type="text"
            value={input.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className={fieldCls}
          />
        </div>
        <div>
          <label className={labelCls}>Surname</label>
          <input
            type="text"
            value={input.surname}
            onChange={(e) => update("surname", e.target.value)}
            className={fieldCls}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Title</label>
          <input
            type="text"
            value={input.title}
            onChange={(e) => update("title", e.target.value)}
            className={fieldCls}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Organization</label>
          <input
            type="text"
            value={input.organization}
            onChange={(e) => update("organization", e.target.value)}
            className={fieldCls}
          />
        </div>
      </div>

      <div className={sectionCls}>Contact Methods</div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Country Code</label>
          <input
            type="text"
            value={input.phoneCountry}
            onChange={(e) => update("phoneCountry", e.target.value)}
            placeholder="+1"
            className={fieldCls}
          />
        </div>
        <div className="sm:col-span-4">
          <label className={labelCls}>Phone</label>
          <input
            type="text"
            value={input.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="555-555-1212"
            className={fieldCls}
          />
        </div>

        <div className="sm:col-span-3">
          <label className={labelCls}>WhatsApp</label>
          <input
            type="text"
            value={input.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+1 555-555-1212 or same as phone"
            className={fieldCls}
          />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>LinkedIn</label>
          <input
            type="text"
            value={input.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="linkedin.com/in/…"
            className={fieldCls}
          />
        </div>

        <div className="sm:col-span-6">
          <label className={labelCls}>Website</label>
          <input
            type="text"
            value={input.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://"
            className={fieldCls}
          />
        </div>
      </div>

      <div className={sectionCls}>Address</div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <div className="sm:col-span-6">
          <label className={labelCls}>Street / Line 1</label>
          <input
            type="text"
            value={input.addressLine1}
            onChange={(e) => update("addressLine1", e.target.value)}
            className={fieldCls}
          />
        </div>
        <div className="sm:col-span-6">
          <label className={labelCls}>Line 2 (apt, suite, floor)</label>
          <input
            type="text"
            value={input.addressLine2}
            onChange={(e) => update("addressLine2", e.target.value)}
            className={fieldCls}
          />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>City</label>
          <input
            type="text"
            value={input.city}
            onChange={(e) => update("city", e.target.value)}
            className={fieldCls}
          />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>State / Province / Region</label>
          <input
            type="text"
            value={input.state}
            onChange={(e) => update("state", e.target.value)}
            className={fieldCls}
          />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>Postal Code</label>
          <input
            type="text"
            value={input.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            className={fieldCls}
          />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>Country</label>
          <input
            type="text"
            value={input.country}
            onChange={(e) => update("country", e.target.value)}
            className={fieldCls}
          />
        </div>
      </div>

      <div className={sectionCls}>CRM Metadata</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>CC Of (scheduler / proxy for…)</label>
          <CcOfPicker
            value={input.ccOf}
            onChange={(email) => update("ccOf", email)}
            contacts={ccOfCandidates}
            fieldCls={fieldCls}
          />
        </div>

        <div>
          <label className={labelCls}>Last Contacted</label>
          <input
            type="date"
            value={input.lastContacted}
            onChange={(e) => update("lastContacted", e.target.value)}
            className={fieldCls}
          />
        </div>
        <div />

        <div className="sm:col-span-2">
          <label className={labelCls}>Notes</label>
          <textarea
            value={input.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className={fieldCls}
          />
        </div>
      </div>

      {initial && schedulers.length > 0 && (
        <>
          <div className={sectionCls}>Schedulers / CCs ({schedulers.length})</div>
          <ul className="space-y-1.5">
            {schedulers.map((s) => {
              const name = [s.firstName, s.surname].filter(Boolean).join(" ") || s.email;
              return (
                <li
                  key={s.rowIndex}
                  className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 rounded"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-sans text-gray-900 truncate">{name}</div>
                    <div className="text-[11px] font-sans text-gray-500 truncate">
                      {s.email}
                      {s.title && <span> · {s.title}</span>}
                    </div>
                  </div>
                  {onOpenContact && (
                    <button
                      type="button"
                      onClick={() => onOpenContact(s)}
                      className="text-[11px] font-sans font-semibold tracking-wider uppercase text-gray-700 hover:text-gray-900 px-2 py-1 hover:bg-white rounded shrink-0"
                    >
                      Open →
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div>
          {onDelete && !confirmDelete && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-2 text-[12px] font-sans font-semibold tracking-wider uppercase text-red-600 hover:bg-red-50 rounded"
            >
              Delete
            </button>
          )}
          {onDelete && confirmDelete && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-sans text-gray-700">Delete this contact?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 text-[12px] font-sans font-semibold tracking-wider uppercase bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 rounded"
              >
                {deleting ? "Deleting…" : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="px-3 py-2 text-[12px] font-sans text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 text-[12px] font-sans font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-[12px] font-sans font-semibold tracking-wider uppercase bg-gray-900 text-white hover:bg-black disabled:opacity-50 rounded"
          >
            {saving ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
