"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { LogEntry } from "@/types/log";

interface Props {
  /** Sheet row index of the contact. Used to scope the API calls. */
  contactRowIndex: number;
  /** Read-only mode disables add/edit/delete UI. */
  readOnly?: boolean;
}

/**
 * Imperative handle exposed via ref. Lets a parent (typically
 * ContactForm/ContactModal) commit pending edits or ask whether the log
 * has unsaved local changes — so the contact form's own "Save Changes"
 * can flush log edits in one go, and the modal can warn on close.
 */
export interface ContactLogHandle {
  /** Commit any pending in-progress edit or unsubmitted new entry. */
  commit: () => Promise<void>;
  /** True if there is text in the new-entry box OR an entry edit
   *  whose draft differs from its original. */
  hasUnsaved: () => boolean;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const sectionCls =
  "text-[10px] font-sans font-semibold tracking-widest uppercase text-gray-500 pt-2 pb-1 border-b border-gray-200 mb-3";

export const ContactLog = forwardRef<ContactLogHandle, Props>(function ContactLog(
  { contactRowIndex, readOnly = false },
  ref
) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editOriginal, setEditOriginal] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/contacts/${contactRowIndex}/log`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load log.");
      setEntries(data.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load log.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactRowIndex]);

  async function addEntry(note: string) {
    const res = await fetch(`/api/admin/contacts/${contactRowIndex}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add entry.");
    return data.entry as LogEntry;
  }

  async function saveEntry(id: string, note: string) {
    const res = await fetch(`/api/admin/log/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save edit.");
    return data.entry as LogEntry;
  }

  async function handleAdd() {
    const note = newNote.trim();
    if (!note) return;
    setAdding(true);
    setError("");
    try {
      const entry = await addEntry(note);
      setNewNote("");
      setEntries((prev) => [entry, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Add failed.");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(entry: LogEntry) {
    setEditingId(entry.id);
    setEditDraft(entry.note);
    setEditOriginal(entry.note);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft("");
    setEditOriginal("");
  }

  async function commitEdit(id: string) {
    const note = editDraft.trim();
    if (!note) return;
    setError("");
    await saveEntry(id, note);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, note } : e)));
    cancelEdit();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this log entry?")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/log/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete.");
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  // Expose imperative handle to parent (ContactForm / ContactModal).
  useImperativeHandle(
    ref,
    () => ({
      hasUnsaved: () => {
        if (readOnly) return false;
        if (newNote.trim().length > 0) return true;
        if (editingId !== null && editDraft.trim() !== editOriginal.trim()) return true;
        return false;
      },
      commit: async () => {
        if (readOnly) return;
        // Commit pending edit first.
        if (editingId !== null && editDraft.trim() !== editOriginal.trim() && editDraft.trim()) {
          try {
            await commitEdit(editingId);
          } catch (err) {
            // Surface to user; do not silently swallow.
            setError(err instanceof Error ? err.message : "Save failed.");
            throw err;
          }
        } else if (editingId !== null) {
          // Edit open but unchanged — just close it.
          cancelEdit();
        }
        // Then append unsaved new note.
        if (newNote.trim()) {
          try {
            await handleAdd();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Add failed.");
            throw err;
          }
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [readOnly, newNote, editingId, editDraft, editOriginal]
  );

  const isDirty =
    !readOnly &&
    (newNote.trim().length > 0 ||
      (editingId !== null && editDraft.trim() !== editOriginal.trim()));

  return (
    <>
      <div className={sectionCls}>
        Conversation Log
        {isDirty && (
          <span className="ml-2 text-amber-700 normal-case tracking-normal font-normal">
            • unsaved changes
          </span>
        )}
      </div>

      {error && (
        <div className="p-2 mb-2 border-l-2 border-red-500 bg-red-50 text-[12px] font-sans text-red-700">
          {error}
        </div>
      )}

      {!readOnly && (
        <div className="mb-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Add a note — anything you want to remember about this conversation"
            rows={2}
            className={`w-full px-3 py-2 bg-white border text-[13px] font-sans text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 rounded transition-colors ${
              newNote.trim() ? "border-amber-400" : "border-gray-300"
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-sans text-gray-400">
              {newNote.trim() ? "Will save when you click Save Changes, or click + Add Entry now" : ""}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !newNote.trim()}
              className="px-4 py-1.5 text-[11px] font-sans font-semibold tracking-wider uppercase bg-gray-900 text-white hover:bg-black disabled:opacity-50 rounded"
            >
              {adding ? "Adding…" : "+ Add Entry"}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-[12px] font-sans text-gray-400 italic">Loading…</p>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-[12px] font-sans text-gray-400 italic">
          No log entries yet{readOnly ? "." : " — add one above."}
        </p>
      )}

      <ul className="space-y-3">
        {entries.map((entry) => {
          const entryDirty =
            editingId === entry.id && editDraft.trim() !== editOriginal.trim();
          return (
            <li key={entry.id} className="group">
              <div className="flex items-baseline gap-3 mb-0.5">
                <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-gray-500">
                  {formatDate(entry.createdAt)}
                </span>
                {entryDirty && (
                  <span className="text-[10px] font-sans text-amber-700">unsaved</span>
                )}
                {!readOnly && editingId !== entry.id && (
                  <span className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => startEdit(entry)}
                      className="text-[10px] font-sans text-gray-500 hover:text-gray-900 underline"
                    >
                      edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="text-[10px] font-sans text-red-600 hover:text-red-800 underline"
                    >
                      delete
                    </button>
                  </span>
                )}
              </div>
              {editingId === entry.id ? (
                <div>
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={2}
                    className={`w-full px-3 py-2 bg-white border text-[13px] font-sans text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 rounded ${
                      entryDirty ? "border-amber-400" : "border-gray-300"
                    }`}
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-[11px] font-sans text-gray-500 hover:text-gray-900 px-2 py-1"
                    >
                      cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => commitEdit(entry.id)}
                      disabled={!entryDirty}
                      className="text-[11px] font-sans font-semibold tracking-wider uppercase bg-gray-900 text-white hover:bg-black disabled:opacity-50 px-3 py-1 rounded"
                    >
                      save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] font-sans text-gray-900 whitespace-pre-line">
                  {entry.note}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
});
