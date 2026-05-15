"use client";

import { useEffect, useState } from "react";
import { Contact, ContactStatus } from "@/types/contacts";
import { LogEntry } from "@/types/log";
import {
  buildFollowUpEmail,
  buildLinkedInUrl,
  pickLatestLogForContact,
} from "@/lib/follow-up-template";
import {
  EMAIL_CLIENT_LABELS,
  EmailClient,
  buildComposeUrl,
  getPreferredClient,
  isWebClient,
  setPreferredClient,
  LS_GMAIL_INDEX_KEY,
} from "@/lib/email-clients";

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
  const [confirmNote, setConfirmNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [client, setClient] = useState<EmailClient>("gmail");
  const [showSettings, setShowSettings] = useState(false);
  const [gmailIndex, setGmailIndex] = useState("");

  useEffect(() => {
    // Initialize preferences from localStorage on first render (client-only).
    setClient(getPreferredClient());
    if (typeof window !== "undefined") {
      setGmailIndex(window.localStorage.getItem(LS_GMAIL_INDEX_KEY) || "");
    }
  }, []);

  function chooseClient(c: EmailClient) {
    setClient(c);
    setPreferredClient(c);
  }

  function saveGmailIndex(v: string) {
    setGmailIndex(v);
    if (typeof window !== "undefined") {
      if (v.trim()) window.localStorage.setItem(LS_GMAIL_INDEX_KEY, v.trim());
      else window.localStorage.removeItem(LS_GMAIL_INDEX_KEY);
    }
  }

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

  // Pre-build the compose URL for the currently-selected client so we
  // can render it as a real <a> href (avoids window.open's flaky behavior
  // with mailto:, which is what was producing the blank tab).
  const composeEmail = (() => {
    const { subject, body } = buildFollowUpEmail(contact, latestLog?.note);
    const cc = contact.schedulerEmail || undefined;
    return buildComposeUrl(client, contact.email, subject, body, cc);
  })();
  const linkedInUrl = buildLinkedInUrl(contact);

  function handleEmailClick() {
    setPendingAction("email");
    setConfirmNote("Sent follow-up email");
  }

  function handleLinkedInClick() {
    setPendingAction("linkedin");
    setConfirmNote("Sent LinkedIn message");
  }

  async function confirmSent() {
    if (!pendingAction) return;
    const note = confirmNote.trim();
    if (!note) {
      setError("Add a short note describing what you did.");
      return;
    }
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

      // 2. Add the log entry with the user's (possibly edited) note.
      await fetch(`/api/admin/contacts/${contact.rowIndex}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      setPendingAction(null);
      setConfirmNote("");
      onStatusChanged?.(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setBusy(false);
    }
  }

  function cancelSent() {
    setPendingAction(null);
    setConfirmNote("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={composeEmail}
          target={isWebClient(client) ? "_blank" : undefined}
          rel={isWebClient(client) ? "noopener noreferrer" : undefined}
          onClick={handleEmailClick}
          className="px-3 py-1.5 text-[12px] font-sans font-semibold tracking-wider uppercase bg-gray-900 text-white hover:bg-black rounded inline-flex items-center gap-1.5"
          title={`Compose in ${EMAIL_CLIENT_LABELS[client]}`}
        >
          ✉ Compose in {EMAIL_CLIENT_LABELS[client]}
        </a>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkedInClick}
          className="px-3 py-1.5 text-[12px] font-sans font-semibold tracking-wider uppercase border border-gray-300 text-gray-700 hover:bg-gray-50 rounded inline-flex items-center gap-1.5"
          title="Open LinkedIn search for this contact"
        >
          in Find on LinkedIn
        </a>
      </div>

      <div className="text-[11px] font-sans text-gray-500 flex items-center flex-wrap gap-x-3 gap-y-1">
        <span>Or open in:</span>
        {(["gmail", "outlook", "mailto"] as EmailClient[])
          .filter((c) => c !== client)
          .map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => chooseClient(c)}
              className="underline hover:text-gray-900"
            >
              {EMAIL_CLIENT_LABELS[c]}
            </button>
          ))}
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          className="underline hover:text-gray-900 ml-auto"
        >
          {showSettings ? "Hide" : "Multi-account?"}
        </button>
      </div>

      {showSettings && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-[12px] font-sans text-gray-700 space-y-2">
          <p className="leading-relaxed">
            If you&apos;re signed into multiple Google accounts, Gmail opens with your default one.
            To target a different account, find its index by opening any Gmail tab and looking at the URL —
            you&apos;ll see <code className="bg-white px-1 rounded">/mail/u/0/</code>, <code className="bg-white px-1 rounded">/mail/u/1/</code>, etc.
            Enter that number here:
          </p>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-gray-600">
              Gmail account index:
            </label>
            <input
              type="text"
              value={gmailIndex}
              onChange={(e) => saveGmailIndex(e.target.value)}
              placeholder="(blank = primary)"
              className="px-2 py-1 border border-gray-300 rounded text-[12px] w-32 font-sans"
            />
          </div>
          <p className="text-[10px] text-gray-500">
            Saved on this browser only. Each user can set their own.
          </p>
        </div>
      )}

      {pendingAction && (
        <div className="p-3 bg-amber-50 border-l-2 border-amber-400 rounded-r">
          <p className="text-[12px] font-sans text-gray-800 mb-2">
            Done? Mark this contact as <strong>Outreach Sent</strong> and add a log entry:
          </p>
          <input
            type="text"
            value={confirmNote}
            onChange={(e) => setConfirmNote(e.target.value)}
            placeholder="What did you do?"
            className="w-full px-2 py-1.5 mb-2 bg-white border border-amber-300 text-[12px] font-sans text-gray-900 outline-none focus:border-amber-600 rounded"
            autoFocus
          />
          {error && (
            <p className="text-[11px] font-sans text-red-700 mb-2">{error}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmSent}
              disabled={busy || !confirmNote.trim()}
              className="px-3 py-1 text-[11px] font-sans font-semibold tracking-wider uppercase bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50 rounded"
            >
              {busy ? "Saving…" : "Mark + log"}
            </button>
            <button
              type="button"
              onClick={cancelSent}
              disabled={busy}
              className="px-3 py-1 text-[11px] font-sans text-gray-600 hover:text-gray-900"
            >
              Not yet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
