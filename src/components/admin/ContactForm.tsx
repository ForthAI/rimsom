"use client";

import { useState } from "react";
import { Contact, HONORIFICS } from "@/types/contacts";
import { ContactInput } from "@/lib/contacts";

interface Props {
  /** When provided, form pre-fills from this contact (edit mode). */
  initial?: Contact;
  onSubmit: (input: ContactInput) => Promise<void>;
  onCancel: () => void;
  /** Show the delete button (edit mode only). */
  onDelete?: () => Promise<void>;
  submitLabel?: string;
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
    phone: "",
    address: "",
    website: "",
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

export function ContactForm({ initial, onSubmit, onCancel, onDelete, submitLabel = "Save" }: Props) {
  const [input, setInput] = useState<ContactInput>(initial ? inputFromContact(initial) : emptyInput());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 border-l-2 border-red-500 bg-red-50 text-[13px] font-sans text-red-700">
          {error}
        </div>
      )}

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

        <div>
          <label className={labelCls}>Phone</label>
          <input
            type="text"
            value={input.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 555-1212"
            className={fieldCls}
          />
        </div>

        <div>
          <label className={labelCls}>Website</label>
          <input
            type="text"
            value={input.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://"
            className={fieldCls}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Address</label>
          <input
            type="text"
            value={input.address}
            onChange={(e) => update("address", e.target.value)}
            className={fieldCls}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>CC Of (scheduler / proxy for…)</label>
          <input
            type="email"
            value={input.ccOf}
            onChange={(e) => update("ccOf", e.target.value)}
            placeholder="primary-contact@example.com"
            className={fieldCls}
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
