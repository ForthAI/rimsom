"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Contact } from "@/types/contacts";

interface Props {
  /** Currently linked primary's email (lowercased), or "" if none. */
  value: string;
  onChange: (email: string) => void;
  /** Full contacts list to search. The current contact (if editing) should be excluded by the caller. */
  contacts: Contact[];
  fieldCls: string;
}

function fullName(c: Contact): string {
  return [c.firstName, c.surname].filter(Boolean).join(" ").trim();
}

function displayLabel(c: Contact): string {
  const name = fullName(c) || c.email;
  return c.organization ? `${name} · ${c.organization}` : name;
}

/**
 * Typeahead for the "CC Of" field. The input stores the linked primary's
 * email, but as the user types we show matching contacts and let them
 * click to select one. A hint line beneath the input confirms which
 * contact the email resolves to (or warns if it doesn't match anyone).
 */
export function CcOfPicker({ value, onChange, contacts, fieldCls }: Props) {
  // Local input state mirrors `value` but lets the user type freely.
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    if (!focused) return;
    function onDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [focused]);

  // Resolve draft → matching contact (if any). Lowercase exact match.
  const matched = useMemo(() => {
    const lc = draft.trim().toLowerCase();
    if (!lc) return null;
    return contacts.find((c) => c.email === lc) || null;
  }, [draft, contacts]);

  // Filter contacts by the draft string across name/email/org.
  const filtered = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q) return contacts.slice(0, 5);
    return contacts
      .filter((c) => {
        return (
          c.email.includes(q) ||
          c.firstName.toLowerCase().includes(q) ||
          c.surname.toLowerCase().includes(q) ||
          c.organization.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [draft, contacts]);

  function commit(c: Contact) {
    onChange(c.email);
    setDraft(c.email);
    setFocused(false);
  }

  function clear() {
    onChange("");
    setDraft("");
  }

  // Hint shown beneath the input when not in dropdown mode.
  let hint: React.ReactNode = null;
  if (draft.trim()) {
    if (matched) {
      hint = (
        <p className="mt-1 text-[11px] font-sans text-gray-500">
          → {displayLabel(matched)}
        </p>
      );
    } else {
      hint = (
        <p className="mt-1 text-[11px] font-sans text-amber-700">
          ⚠ Not in contacts — they won&apos;t appear in this list. Pick from the dropdown or leave blank.
        </p>
      );
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(e.target.value.toLowerCase().trim());
          }}
          onFocus={() => setFocused(true)}
          placeholder="Type a name, email, or organization…"
          className={fieldCls}
        />
        {draft && (
          <button
            type="button"
            onClick={clear}
            className="text-[12px] font-sans text-gray-500 hover:text-gray-900 px-2"
            aria-label="Clear"
          >
            ×
          </button>
        )}
      </div>
      {hint}

      {focused && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 left-0 right-0 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
          {filtered.map((c) => (
            <li key={c.rowIndex}>
              <button
                type="button"
                onClick={() => commit(c)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="text-[13px] font-sans text-gray-900">
                  {fullName(c) || c.email}
                </div>
                <div className="text-[11px] font-sans text-gray-500">
                  {c.email}
                  {c.organization && <span> · {c.organization}</span>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {focused && filtered.length === 0 && draft.trim() && (
        <div className="absolute z-10 mt-1 left-0 right-0 bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-[12px] font-sans text-gray-500">
          No matching contacts.
        </div>
      )}
    </div>
  );
}
