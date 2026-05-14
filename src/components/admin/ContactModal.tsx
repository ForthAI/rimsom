"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/types/contacts";
import { ContactInput } from "@/lib/contacts";
import { ContactForm } from "./ContactForm";
import { ContactView } from "./ContactView";

type Mode = "add" | "view" | "edit";

interface Props {
  initialMode: Mode;
  contact?: Contact;
  onClose: () => void;
  onSubmit: (input: ContactInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

/**
 * Renders a contact in either a read-only view or an editable form,
 * with the ability to switch from view -> edit internally. Parent only
 * mounts this when the modal should be open; mount = open, unmount = closed.
 *
 * `initialMode`:
 *   "add"  -> form, blank
 *   "view" -> read-only view of `contact`, with an Edit button to switch
 *   "edit" -> form pre-filled with `contact`
 */
export function ContactModal({ initialMode, contact, onClose, onSubmit, onDelete }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while mounted.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const title =
    mode === "add" ? "Add Contact" : mode === "view" ? "Contact" : "Edit Contact";
  const submitLabel = mode === "add" ? "Add Contact" : "Save Changes";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 py-8 sm:py-16">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-lg z-10">
            <h2 className="font-sans text-[16px] font-semibold text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-gray-900 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="px-6 py-5">
            {mode === "view" && contact ? (
              <ContactView
                contact={contact}
                onEdit={() => setMode("edit")}
                onClose={onClose}
              />
            ) : (
              <ContactForm
                key={contact?.rowIndex || "new"}
                initial={mode === "edit" ? contact : undefined}
                onSubmit={onSubmit}
                onCancel={onClose}
                onDelete={mode === "edit" ? onDelete : undefined}
                submitLabel={submitLabel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
