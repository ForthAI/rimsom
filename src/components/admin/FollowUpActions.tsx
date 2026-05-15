"use client";

import { useEffect, useState } from "react";
import { Contact, ContactStatus } from "@/types/contacts";
import { LogEntry } from "@/types/log";
import {
  buildFollowUpEmail,
  buildLinkedInUrl,
  buildMailtoUrl,
  pickLatestLogForContact,
} from "@/lib/follow-up-template";

interface Props {
  contact: Contact;
  /** Fired after a successful status change so the parent can refresh. */
  onStatusChanged?: (newStatus: ContactStatus) => void;
}

/**
 * Quick-action panel in ContactView: opens a pre-filled email in the
 * user's mail client, or a LinkedIn people-search for the contact.
 * After clicking either, prompts "Did you send it?" — if yes, advances
 * status to "Outreach Sent" and appends a log entry.
 */
export function FollowUpActions({ contact, onStatusChanged }: Props) {
  const [latestLog, setLatestLog] = useState<LogEntry | null>(null);
  const [pendingAction, setPendingAction] = useState<null | "email" | "linkedin">(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all logs for this contact so we can use the latest as context.
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/contacts/${contact.rowIndex}/log`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const all: LogEntry[] = data.entries || [];
        const latest = pickLatestLogForContact(contact.email, all);
        setLatestLog(latest);
      } catch {
        // Non-fatal — template falls back to generic phrasing.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contact.rowIndex, contact.email]);

  function handleEmailClick() {
    const { subject, body } = buildFollowUpEmail(contact, latestLog?.note);
    const cc = contact.schedulerEmail || undefined;
    const url = buildMailtoUrl(contact.email, subject, body, cc);
    window.open(url, "_blank");
    setPendingAction("email");
  }

  function handleLinkedInClick() {
    const url = buildLinkedInUrl(contact);
    window.open(url, "_blank", "noopener,noreferrer");
    setPendingAction("linkedin");
  }

  async function confirmSent() {
    if (!pendingAction) return;
    setBusy(true);
    setError("");
    try {
      // 1. Bump status to "Outreach Sent" (if not already past that).
      const newStatus: ContactStatus =
        contact.status === "Connected" ? "Connected" : "Outreach Sent";
      const sRes = await fetch(`/api/admin/contacts/${contact.rowIndex}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!sRes.ok) {
        const data = await sRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status.");
      }

      // 2. Add a log entry recording the action.
      const noteText =
        pendingAction === "email"
          ? "Sent follow-up email"
          : "Opened LinkedIn — connection requested";
      await fetch(`/api/admin/contacts/${contact.rowIndex}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText }),
      });

      setPendingAction(null);
      onStatusChanged?.(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setBusy(false);
    }
  }

  function cancelSent() {
    setPendingAction(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleEmailClick}
          className="px-3 py-1.5 text-[12px] font-sans font-semibold tracking-wider uppercase bg-gray-900 text-white hover:bg-black rounded inline-flex items-center gap-1.5"
          title="Open a pre-filled follow-up email in your mail client"
        >
          ✉ Compose Email
        </button>
        <button
          type="button"
          onClick={handleLinkedInClick}
          className="px-3 py-1.5 text-[12px] font-sans font-semibold tracking-wider uppercase border border-gray-300 text-gray-700 hover:bg-gray-50 rounded inline-flex items-center gap-1.5"
          title="Open LinkedIn search for this contact"
        >
          in Find on LinkedIn
        </button>
      </div>

      {pendingAction && (
        <div className="p-3 bg-amber-50 border-l-2 border-amber-400 rounded-r">
          <p className="text-[12px] font-sans text-gray-800 mb-2">
            Did you {pendingAction === "email" ? "send the email" : "send a connection request"}?
            Mark this contact as <strong>Outreach Sent</strong> and log it?
          </p>
          {error && (
            <p className="text-[11px] font-sans text-red-700 mb-2">{error}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmSent}
              disabled={busy}
              className="px-3 py-1 text-[11px] font-sans font-semibold tracking-wider uppercase bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50 rounded"
            >
              {busy ? "Saving…" : "Yes, mark + log"}
            </button>
            <button
              type="button"
              onClick={cancelSent}
              disabled={busy}
              className="px-3 py-1 text-[11px] font-sans text-gray-600 hover:text-gray-900"
            >
              No / not yet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
