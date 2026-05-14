"use client";

import { useEffect } from "react";
import { Contact } from "@/types/contacts";
import { ContactInput } from "@/lib/contacts";
import { ContactForm } from "./ContactForm";

interface Props {
  open: boolean;
  mode: "add" | "edit";
  contact?: Contact;
  onClose: () => void;
  onSubmit: (input: ContactInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function ContactModal({ open, mode, contact, onClose, onSubmit, onDelete }: Props) {
  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const title = mode === "add" ? "Add Contact" : "Edit Contact";
  const submitLabel = mode === "add" ? "Add Contact" : "Save Changes";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center p-4 py-8 sm:py-16">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
