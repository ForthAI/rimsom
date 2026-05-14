"use client";

import { useEffect } from "react";
import { Contact } from "@/types/contacts";
import { ContactInput } from "@/lib/contacts";
import { ContactForm } from "./ContactForm";

interface Props {
  mode: "add" | "edit";
  contact?: Contact;
  onClose: () => void;
  onSubmit: (input: ContactInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  /** Full contacts list — passed through to the form for CC-Of picker + Schedulers view. */
  allContacts?: Contact[];
  /** Switch the modal to a different contact (used by Schedulers section). */
  onOpenContact?: (c: Contact) => void;
}

/**
 * Renders the contact form in a modal. Parent should only render this
 * component when the modal should be open — there is no `open` prop;
 * mount = open, unmount = closed. Effects guarantee body scroll is
 * restored on unmount even if the parent forgets to.
 */
export function ContactModal({
  mode,
  contact,
  onClose,
  onSubmit,
  onDelete,
  allContacts,
  onOpenContact,
}: Props) {
  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while mounted. Always reset to empty string on
  // cleanup — safer than capturing `prev` in case the page never had
  // scroll locked and `prev` happened to be a stale value.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const title = mode === "add" ? "Add Contact" : "Edit Contact";
  const submitLabel = mode === "add" ? "Add Contact" : "Save Changes";

  // Outside-click intentionally does NOT close — protects in-progress edits.
  // Close via X, Cancel button, or Escape key.
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
            <ContactForm
              key={contact?.rowIndex || "new"}
              initial={contact}
              onSubmit={onSubmit}
              onCancel={onClose}
              onDelete={mode === "edit" ? onDelete : undefined}
              submitLabel={submitLabel}
              allContacts={allContacts}
              onOpenContact={onOpenContact}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
