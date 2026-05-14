"use client";

import { useEffect, useState } from "react";
import { LogEntry } from "@/types/log";

interface Props {
  /** Sheet row index of the contact. Used to scope the API calls. */
  contactRowIndex: number;
  /** Read-only mode disables add/edit/delete UI. */
  readOnly?: boolean;
}

function formatDate(iso: string): string {
  // Render the date portion only; entries are user-facing per-day.
  // ISO strings sort/compare correctly as strings.
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const sectionCls =
  "text-[10px] font-sans font-semibold tracking-widest uppercase text-gray-500 pt-2 pb-1 border-b border-gray-200 mb-3";

export function ContactLog({ contactRowIndex, readOnly = false }: Props) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

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

  async function handleAdd() {
    const note = newNote.trim();
    if (!note) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/contacts/${contactRowIndex}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add entry.");
      setNewNote("");
      // Prepend the new entry — also refetch to be safe.
      setEntries((prev) => [data.entry, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Add failed.");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(entry: LogEntry) {
    setEditingId(entry.id);
    setEditDraft(entry.note);
  }

  async function saveEdit(id: string) {
    const note = editDraft.trim();
    if (!note) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/log/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save edit.");
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, note } : e)));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    }
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

  return (
    <>
      <div className={sectionCls}>Conversation Log</div>

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
              // Cmd/Ctrl+Enter to submit, matching common chat-style affordance
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Add a note — anything you want to remember about this conversation"
            rows={2}
            className="w-full px-3 py-2 bg-white border border-gray-300 text-[13px] font-sans text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 rounded transition-colors"
          />
          <div className="flex justify-end mt-2">
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
        {entries.map((entry) => (
          <li key={entry.id} className="group">
            <div className="flex items-baseline gap-3 mb-0.5">
              <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-gray-500">
                {formatDate(entry.createdAt)}
              </span>
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-[13px] font-sans text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 rounded"
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-[11px] font-sans text-gray-500 hover:text-gray-900 px-2 py-1"
                  >
                    cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => saveEdit(entry.id)}
                    className="text-[11px] font-sans font-semibold tracking-wider uppercase bg-gray-900 text-white hover:bg-black px-3 py-1 rounded"
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
        ))}
      </ul>
    </>
  );
}
