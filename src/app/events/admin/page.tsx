"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface EventData {
  slug: string;
  name: string;
  date: string;
  venueName?: string;
  inviteCount: number;
  headers: string[];
  rsvps: string[][];
  error?: string;
}

type Tab = "rsvps" | "invites" | "assets";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [eventSelected, setEventSelected] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("rsvps");
  // Invite management state
  const [invites, setInvites] = useState<string[][]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  // Asset management state
  const [assets, setAssets] = useState<string[][]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [newAssetItem, setNewAssetItem] = useState("");
  const [newAssetType, setNewAssetType] = useState("");
  const [newAssetOwner, setNewAssetOwner] = useState("");
  const [newAssetDue, setNewAssetDue] = useState("");
  const [newAssetNotes, setNewAssetNotes] = useState("");
  const [newAssetQty, setNewAssetQty] = useState("");
  const [assetMessage, setAssetMessage] = useState("");
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editingCC, setEditingCC] = useState<number | null>(null);
  const [editingGuests, setEditingGuests] = useState<number | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/events/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.authenticated) setAuthenticated(true);
      else setAuthError(data.message || "Invalid password.");
    } catch {
      setAuthError("Something went wrong.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Check if already authenticated on page load (cookie still valid)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/events/admin");
        if (res.ok) {
          setAuthenticated(true);
        }
      } catch {
        // not authenticated, show login
      }
    };
    checkAuth();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events/admin");
      if (res.status === 401) { setAuthenticated(false); return; }
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      console.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvites = useCallback(async () => {
    const slug = selectedSlug || events[0]?.slug;
    if (!slug) return;
    setInviteLoading(true);
    try {
      const res = await fetch(`/api/events/invites?slug=${slug}`);
      if (res.status === 401) { setAuthenticated(false); return; }
      const data = await res.json();
      setInvites(data.invites || []);
    } catch {
      console.error("Failed to fetch invites");
    } finally {
      setInviteLoading(false);
    }
  }, [selectedSlug, events]);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  // Auto-select first event when data loads
  useEffect(() => {
    if (events.length > 0 && !selectedSlug) {
      setSelectedSlug(events[0].slug);
    }
  }, [events, selectedSlug]);

  const fetchAssets = useCallback(async () => {
    const slug = selectedSlug || events[0]?.slug;
    if (!slug) return;
    setAssetLoading(true);
    try {
      const res = await fetch(`/api/events/assets?slug=${slug}`);
      if (res.status === 401) { setAuthenticated(false); return; }
      const data = await res.json();
      setAssets(data.assets || []);
    } catch {
      console.error("Failed to fetch assets");
    } finally {
      setAssetLoading(false);
    }
  }, [selectedSlug, events]);

  // Fetch invites for both tabs (needed for VIP data on door list)
  useEffect(() => {
    if (authenticated && selectedSlug) fetchInvites();
  }, [authenticated, fetchInvites, selectedSlug]);

  // Fetch assets when on assets tab
  useEffect(() => {
    if (authenticated && selectedSlug && tab === "assets") fetchAssets();
  }, [authenticated, selectedSlug, tab, fetchAssets]);

  // Refresh when switching tabs
  useEffect(() => {
    if (authenticated && tab === "rsvps") fetchData();
  }, [authenticated, tab, fetchData]);

  const rawEvent = events.find((e) => e.slug === selectedSlug) || events[0];
  const selectedEvent = rawEvent ? {
    ...rawEvent,
    headers: rawEvent.headers || [],
    rsvps: rawEvent.rsvps || [],
    inviteCount: rawEvent.inviteCount || 0,
  } : null;
  const activeSlug = selectedSlug || events[0]?.slug;

  const addSingleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !activeSlug) return;
    setInviteMessage("");
    try {
      const res = await fetch("/api/events/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: activeSlug,
          emails: [{ email: newEmail.trim(), name: newName.trim(), organization: newOrg.trim() }],
        }),
      });
      const data = await res.json();
      if (data.duplicates > 0) {
        setInviteMessage(`Already on list: ${data.duplicateEmails.join(", ")}`);
      } else {
        setInviteMessage(`Added ${data.added} invite.`);
        setNewEmail(""); setNewName(""); setNewOrg("");
      }
      fetchInvites();
      fetchData();
    } catch {
      setInviteMessage("Failed to add invite.");
    }
  };

  const addBulkInvites = async () => {
    if (!bulkEmails.trim() || !activeSlug) return;
    setInviteMessage("");
    const lines = bulkEmails.split("\n").filter((l) => l.trim());
    const emails = lines.map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      return { email: parts[0], name: parts[1] || "", organization: parts[2] || "" };
    });
    try {
      const res = await fetch("/api/events/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: activeSlug, emails }),
      });
      const data = await res.json();
      setInviteMessage(`Added ${data.added}. ${data.duplicates > 0 ? `${data.duplicates} already on list.` : ""}`);
      setBulkEmails("");
      setShowBulk(false);
      fetchInvites();
      fetchData();
    } catch {
      setInviteMessage("Failed to add invites.");
    }
  };

  const removeInvite = async (email: string) => {
    if (!activeSlug || !confirm(`Remove ${email} from the invite list?`)) return;
    try {
      await fetch("/api/events/invites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: activeSlug, email }),
      });
      fetchInvites();
      fetchData();
    } catch {
      console.error("Failed to remove invite");
    }
  };

  const exportCsv = () => {
    if (!selectedEvent) return;
    const rows = [selectedEvent.headers, ...selectedEvent.rsvps];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedEvent.slug}-rsvps.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <Image src="/logo-white.svg" alt="Rimsom Global" width={140} height={44} className="h-10 w-auto mx-auto mb-6" />
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-white/40">
              Event Administration
            </p>
          </div>
          {authError && (
            <div className="mb-6 p-4 border-l-2 border-red-500 bg-red-500/10">
              <p className="font-sans text-[14px] text-red-300">{authError}</p>
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-3.5 pr-12 bg-white/10 border border-white/20 text-[14px] text-white font-sans outline-none focus:border-brand-gold transition-colors duration-200 placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-brand-gold text-white text-[13px] font-sans font-semibold tracking-wider uppercase hover:bg-brand-gold-light transition-colors disabled:opacity-50"
            >
              {authLoading ? "Authenticating..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Event picker
  if (!eventSelected) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Image src="/logo-white.svg" alt="Rimsom Global" width={140} height={44} className="h-10 w-auto mx-auto mb-6" />
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-white/40">
              Select an Event
            </p>
          </div>
          <div className="space-y-3">
            {events.map((ev) => (
              <button
                key={ev.slug}
                onClick={() => { setSelectedSlug(ev.slug); setEventSelected(true); }}
                className="w-full text-left p-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 rounded"
              >
                <p className="font-sans text-[15px] font-semibold text-white mb-1">{ev.name}</p>
                <p className="font-sans text-[13px] text-white/50">{ev.date} &middot; {ev.venueName}</p>
              </button>
            ))}
          </div>
          {events.length === 0 && (
            <p className="text-center font-sans text-[14px] text-white/40 mt-8">Loading events...</p>
          )}
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-navy text-white no-print">
        <div className="max-w-content mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo-white.svg" alt="Rimsom Global" width={120} height={38} className="h-8 w-auto" />
            <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-white/40">Events Admin</span>
          </div>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 text-[13px] text-white font-sans outline-none rounded"
          >
            {events.map((ev) => (
              <option key={ev.slug} value={ev.slug}>{ev.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Event banner */}
      {selectedEvent && (
        <div className="bg-brand-offwhite border-b border-gray-200 no-print">
          <div className="max-w-content mx-auto px-6 md:px-10 py-3 flex items-center gap-4">
            <h2 className="font-sans text-[15px] font-bold text-brand-dark">{selectedEvent.name}</h2>
            <span className="text-[13px] text-brand-muted">{selectedEvent.date}</span>
            <span className="text-[13px] text-brand-muted">{selectedEvent.venueName}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white no-print">
        <div className="max-w-content mx-auto px-6 md:px-10 flex gap-6">
          {(["rsvps", "invites", "assets"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-[12px] font-sans font-semibold tracking-wide uppercase border-b-2 transition-colors ${
                tab === t
                  ? "border-brand-dark text-brand-dark"
                  : "border-transparent text-brand-muted hover:text-brand-dark"
              }`}
            >
              {t === "rsvps" ? "RSVPs" : t === "invites" ? "Invite List" : "Assets"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-8">
        {loading ? (
          <p className="text-brand-gray font-sans text-[14px]">Loading...</p>
        ) : tab === "rsvps" && selectedEvent ? (
          <>
            {/* Stats + Table */}
            {(() => {
              const attendingIdx = selectedEvent.headers.indexOf("Attending");
              const emailIdx = selectedEvent.headers.indexOf("Email");
              const firstNameIdx = selectedEvent.headers.indexOf("First Name");
              const surnameIdx = selectedEvent.headers.indexOf("Surname");
              const titleIdx = selectedEvent.headers.indexOf("Title");
              const orgIdx = selectedEvent.headers.indexOf("Organization");
              const timestampIdx = selectedEvent.headers.indexOf("Timestamp") >= 0
                ? selectedEvent.headers.indexOf("Timestamp")
                : selectedEvent.headers.length - 1;

              const vipEmails = new Set(
                invites.slice(1).filter((r) => (r[7] || "").toLowerCase() === "yes").map((r) => (r[0] || "").toLowerCase())
              );

              // Build RSVP email set for cross-reference
              const rsvpEmails = new Set(
                selectedEvent.rsvps.map((r) => emailIdx >= 0 ? (r[emailIdx] || "").toLowerCase() : "")
              );

              // Pending = invited with status "Sent" but no RSVP
              const pendingRows = invites.slice(1)
                .filter((inv) => {
                  const email = (inv[0] || "").toLowerCase();
                  const status = (inv[5] || "").toLowerCase();
                  return status === "sent" && !rsvpEmails.has(email);
                })
                .map((inv) => ({
                  email: inv[0] || "",
                  firstName: "",
                  surname: "",
                  title: "",
                  organization: inv[2] || "",
                  name: inv[1] || "",
                  status: "Pending" as const,
                  date: inv[6] || "",
                  isVip: (inv[7] || "").toLowerCase() === "yes",
                }));

              // Yes/No rows from actual RSVPs
              const respondedRows = selectedEvent.rsvps.map((r) => {
                const email = emailIdx >= 0 ? (r[emailIdx] || "").toLowerCase() : "";
                const attending = attendingIdx >= 0 ? (r[attendingIdx] || "").toLowerCase() : "";
                return {
                  email,
                  firstName: firstNameIdx >= 0 ? r[firstNameIdx] || "" : "",
                  surname: surnameIdx >= 0 ? r[surnameIdx] || "" : "",
                  title: titleIdx >= 0 ? r[titleIdx] || "" : "",
                  organization: orgIdx >= 0 ? r[orgIdx] || "" : "",
                  name: "",
                  status: (attending === "yes" ? "Yes" : "No") as "Yes" | "No",
                  date: r[timestampIdx] || "",
                  isVip: vipEmails.has(email),
                };
              });

              const allRows = [...respondedRows, ...pendingRows];
              const yesCount = respondedRows.filter((r) => r.status === "Yes").length;
              const noCount = respondedRows.filter((r) => r.status === "No").length;
              const pendingCount = pendingRows.length;
              // Total outreach = everyone who responded + those still pending
              const totalOutreach = yesCount + noCount + pendingCount;

              return (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 no-print">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <p className="text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted mb-1">Invited</p>
                      <p className="font-sans text-3xl font-bold text-brand-dark">{selectedEvent.inviteCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <p className="text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted mb-1">Pending</p>
                      <p className="font-sans text-3xl font-bold text-amber-500">{pendingCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <p className="text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted mb-1">Attending</p>
                      <p className="font-sans text-3xl font-bold text-green-600">{yesCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <p className="text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted mb-1">Declined</p>
                      <p className="font-sans text-3xl font-bold text-red-500">{noCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <p className="text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted mb-1">Response Rate</p>
                      <p className="font-sans text-3xl font-bold text-brand-dark">
                        {totalOutreach > 0 ? Math.round(((yesCount + noCount) / totalOutreach) * 100) : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mb-6 no-print">
                    <button onClick={() => window.print()} className="px-4 py-2 text-[12px] font-sans font-semibold tracking-wide uppercase border border-gray-300 text-brand-dark hover:bg-gray-100 transition-colors rounded">
                      Print Door List
                    </button>
                    <button onClick={exportCsv} className="px-4 py-2 text-[12px] font-sans font-semibold tracking-wide uppercase border border-gray-300 text-brand-dark hover:bg-gray-100 transition-colors rounded">
                      Export CSV
                    </button>
                    <button onClick={() => { fetchData(); fetchInvites(); }} className="px-4 py-2 text-[12px] font-sans font-semibold tracking-wide uppercase border border-gray-300 text-brand-dark hover:bg-gray-100 transition-colors rounded">
                      Refresh
                    </button>
                  </div>

                  {/* RSVP Table with Pending rows */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto no-print">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Email</th>
                          <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Name</th>
                          <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Title</th>
                          <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Organization</th>
                          <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Status</th>
                          <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Date</th>
                          <th className="px-4 py-3 text-center text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">VIP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRows.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-sans text-[13px] text-brand-dark whitespace-nowrap">{row.email}</td>
                            <td className="px-4 py-3 font-sans text-[13px] text-brand-dark whitespace-nowrap">
                              {row.status === "Pending"
                                ? row.name || "—"
                                : [row.firstName, row.surname].filter(Boolean).join(" ") || "—"
                              }
                            </td>
                            <td className="px-4 py-3 font-sans text-[13px] text-brand-gray whitespace-nowrap">{row.title || "—"}</td>
                            <td className="px-4 py-3 font-sans text-[13px] text-brand-gray whitespace-nowrap">{row.organization || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-0.5 text-[11px] font-sans font-semibold rounded ${
                                row.status === "Yes" ? "bg-green-50 text-green-700" :
                                row.status === "No" ? "bg-red-50 text-red-600" :
                                "bg-amber-50 text-amber-600"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-sans text-[12px] text-brand-muted whitespace-nowrap">{row.date || "—"}</td>
                            <td className="px-4 py-3 text-center">
                              {row.isVip && row.status === "Yes" ? <span className="text-brand-gold text-lg">★</span> : ""}
                            </td>
                          </tr>
                        ))}
                        {allRows.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center font-sans text-[14px] text-brand-muted">No RSVPs yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}

            {/* Door List — print only, hidden on screen */}
            {(() => {
              const attendingIdx = selectedEvent.headers.indexOf("Attending");
              const firstNameIdx = selectedEvent.headers.indexOf("First Name");
              const surnameIdx = selectedEvent.headers.indexOf("Surname");
              const titleIdx = selectedEvent.headers.indexOf("Title");
              const orgIdx = selectedEvent.headers.indexOf("Organization");
              const emailIdx = selectedEvent.headers.indexOf("Email");
              const vipEmails = new Set(
                invites.slice(1).filter((r) => (r[7] || "").toLowerCase() === "yes").map((r) => (r[0] || "").toLowerCase())
              );
              const attending = selectedEvent.rsvps
                .filter((r) => attendingIdx >= 0 && (r[attendingIdx] || "").toLowerCase() === "yes")
                .sort((a, b) => {
                  const surnameA = (surnameIdx >= 0 ? a[surnameIdx] : "").toLowerCase();
                  const surnameB = (surnameIdx >= 0 ? b[surnameIdx] : "").toLowerCase();
                  return surnameA.localeCompare(surnameB);
                });
              return (
                <div className="hidden print:block">
                  <div className="p-6 border-b border-gray-200">
                    <h1 className="font-sans text-xl font-bold text-brand-dark">{selectedEvent.name} — Door List</h1>
                    <p className="font-sans text-[13px] text-brand-gray">{selectedEvent.date} &middot; {selectedEvent.venueName}</p>
                    <p className="font-sans text-[12px] text-brand-muted mt-1">{attending.length} guests</p>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 w-8 text-left text-[11px] font-sans font-semibold">#</th>
                        <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold">Surname</th>
                        <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold">First Name</th>
                        <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold">Title</th>
                        <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold">Organization</th>
                        <th className="px-4 py-3 text-center text-[11px] font-sans font-semibold">VIP</th>
                        <th className="px-4 py-3 text-center text-[11px] font-sans font-semibold">✓</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attending.map((row, i) => {
                        const email = emailIdx >= 0 ? (row[emailIdx] || "").toLowerCase() : "";
                        const isVip = vipEmails.has(email);
                        return (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-4 py-2 text-[12px]">{i + 1}</td>
                            <td className="px-4 py-2 text-[13px] font-medium">{surnameIdx >= 0 ? row[surnameIdx] : ""}</td>
                            <td className="px-4 py-2 text-[12px]">{firstNameIdx >= 0 ? row[firstNameIdx] : ""}</td>
                            <td className="px-4 py-2 text-[12px]">{titleIdx >= 0 ? row[titleIdx] : ""}</td>
                            <td className="px-4 py-2 text-[12px]">{orgIdx >= 0 ? row[orgIdx] : ""}</td>
                            <td className="px-4 py-2 text-center">{isVip ? "★" : ""}</td>
                            <td className="px-4 py-2 text-center">☐</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </>
        ) : tab === "invites" ? (
          <>
            {/* Add invite form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans text-[14px] font-semibold text-brand-dark">Add to Invite List</h3>
                <button
                  onClick={() => setShowBulk(!showBulk)}
                  className="text-[12px] font-sans font-semibold text-brand-gold hover:text-brand-gold-light transition-colors"
                >
                  {showBulk ? "Single add" : "Bulk add"}
                </button>
              </div>

              {inviteMessage && (
                <div className="mb-4 p-3 bg-brand-offwhite rounded text-[13px] font-sans text-brand-dark">
                  {inviteMessage}
                </div>
              )}

              {showBulk ? (
                <div>
                  <p className="font-sans text-[12px] text-brand-muted mb-2">
                    One per line: email, name, organization (name and org are optional)
                  </p>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder={"john@example.com, John Smith, Acme Corp\njane@example.com, Jane Doe"}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors duration-200 resize-none mb-3 font-mono"
                  />
                  <button
                    onClick={addBulkInvites}
                    className="px-5 py-2.5 bg-brand-gold text-white text-[12px] font-sans font-semibold tracking-wide uppercase hover:bg-brand-gold-light transition-colors rounded"
                  >
                    Add All
                  </button>
                </div>
              ) : (
                <form onSubmit={addSingleInvite} className="flex flex-col md:flex-row gap-3">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Email *"
                    required
                    className="flex-1 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Name"
                    className="md:w-40 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    placeholder="Organization"
                    className="md:w-40 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-gold text-white text-[12px] font-sans font-semibold tracking-wide uppercase hover:bg-brand-gold-light transition-colors rounded whitespace-nowrap"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>

            {/* Invite list table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              {inviteLoading ? (
                <p className="p-6 font-sans text-[14px] text-brand-muted">Loading invites...</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Email</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Name</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Organization</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">CC</th>
                      <th className="px-4 py-3 text-center text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Guests</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Date Sent</th>
                      <th className="px-4 py-3 text-center text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">VIP</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.slice(1).map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-sans text-[13px] text-brand-dark">{row[0]}</td>
                        <td className="px-4 py-3 font-sans text-[13px] text-brand-gray">{row[1] || "—"}</td>
                        <td className="px-4 py-3 font-sans text-[13px] text-brand-gray">{row[2] || "—"}</td>
                        <td className="px-4 py-3 max-w-[200px]">
                          {editingCC === i ? (
                            <input
                              autoFocus
                              type="text"
                              defaultValue={row[3] || ""}
                              onBlur={async (e) => {
                                const val = e.target.value;
                                setEditingCC(null);
                                if (val === (row[3] || "")) return;
                                setInvites(prev => {
                                  const updated = prev.map(r => [...r]);
                                  while (updated[i + 1].length < 8) updated[i + 1].push("");
                                  updated[i + 1][3] = val;
                                  return updated;
                                });
                                try {
                                  await fetch("/api/events/invites", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ slug: activeSlug, email: row[0], field: "cc", value: val }),
                                  });
                                } catch { fetchInvites(); }
                              }}
                              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") setEditingCC(null); }}
                              className="w-full px-2 py-1 text-[11px] font-sans text-brand-dark border border-brand-light rounded outline-none focus:border-brand-dark"
                            />
                          ) : (
                            <span
                              onClick={() => setEditingCC(i)}
                              className="font-sans text-[11px] text-brand-muted truncate block cursor-pointer hover:text-brand-dark"
                              title={row[3] || "Click to add CC"}
                            >
                              {row[3] || "—"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {editingGuests === i ? (
                            <input
                              autoFocus
                              type="number"
                              min="0"
                              max="10"
                              defaultValue={row[4] || "0"}
                              onBlur={async (e) => {
                                const val = e.target.value;
                                setEditingGuests(null);
                                if (val === (row[4] || "0")) return;
                                setInvites(prev => {
                                  const updated = prev.map(r => [...r]);
                                  while (updated[i + 1].length < 8) updated[i + 1].push("");
                                  updated[i + 1][4] = val;
                                  return updated;
                                });
                                try {
                                  await fetch("/api/events/invites", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ slug: activeSlug, email: row[0], field: "guests", value: val }),
                                  });
                                } catch { fetchInvites(); }
                              }}
                              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") setEditingGuests(null); }}
                              className="w-16 px-2 py-1 text-[13px] font-sans text-brand-dark text-center border border-brand-light rounded outline-none focus:border-brand-dark"
                            />
                          ) : (
                            <span
                              onClick={() => setEditingGuests(i)}
                              className="font-sans text-[13px] text-brand-gray cursor-pointer hover:text-brand-dark"
                            >
                              {row[4] || "0"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={row[5] || "Not Sent"}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              const dateSent = newStatus === "Sent"
                                ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
                                : "";
                              setInvites(prev => {
                                const updated = prev.map(r => [...r]);
                                updated[i + 1][5] = newStatus;
                                updated[i + 1][6] = dateSent;
                                return updated;
                              });
                              try {
                                await fetch("/api/events/invites", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ slug: activeSlug, email: row[0], status: newStatus }),
                                });
                              } catch {
                                console.error("Failed to update status");
                                fetchInvites();
                              }
                            }}
                            className={`px-2 py-1 text-[12px] font-sans font-medium border rounded outline-none cursor-pointer ${
                              (row[5] || "Not Sent") === "Sent" ? "border-green-200 bg-green-50 text-green-700" :
                              (row[5] || "Not Sent") === "Bounced" ? "border-orange-200 bg-orange-50 text-orange-700" :
                              "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            <option value="Not Sent">Not Sent</option>
                            <option value="Sent">Sent</option>
                            <option value="Bounced">Bounced</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 font-sans text-[12px] text-brand-muted whitespace-nowrap">{row[6] || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={async () => {
                              const isVip = (row[7] || "").toLowerCase() === "yes";
                              setInvites(prev => {
                                const updated = prev.map(r => [...r]);
                                updated[i + 1][7] = !isVip ? "Yes" : "";
                                return updated;
                              });
                              try {
                                await fetch("/api/events/invites", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ slug: activeSlug, email: row[0], vip: !isVip }),
                                });
                              } catch {
                                console.error("Failed to update VIP");
                                fetchInvites();
                              }
                            }}
                            className="transition-colors"
                            title={row[7] === "Yes" ? "Remove VIP" : "Mark as VIP"}
                          >
                            {(row[7] || "").toLowerCase() === "yes" ? (
                              <span className="text-brand-gold text-lg">★</span>
                            ) : (
                              <span className="text-gray-300 hover:text-brand-gold text-lg">☆</span>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeInvite(row[0])}
                            className="text-[11px] font-sans text-red-400 hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            &#10005;
                          </button>
                        </td>
                      </tr>
                    ))}
                    {invites.length <= 1 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center font-sans text-[14px] text-brand-muted">
                          No invites yet. Add emails above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <p className="mt-3 font-sans text-[12px] text-brand-muted">
              {invites.length > 1 ? invites.length - 1 : 0} invites total
            </p>
          </>
        ) : tab === "assets" ? (
          <>
            {/* Add asset form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="font-sans text-[14px] font-semibold text-brand-dark mb-4">Add Asset</h3>

              {assetMessage && (
                <div className="mb-4 p-3 bg-brand-offwhite rounded text-[13px] font-sans text-brand-dark">
                  {assetMessage}
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newAssetItem.trim() || !activeSlug) return;
                  setAssetMessage("");
                  try {
                    await fetch("/api/events/assets", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        slug: activeSlug,
                        item: newAssetItem.trim(),
                        type: newAssetType,
                        owner: newAssetOwner.trim(),
                        dueDate: newAssetDue,
                        notes: newAssetNotes.trim(),
                        quantity: newAssetQty.trim(),
                      }),
                    });
                    setAssetMessage(`Added "${newAssetItem.trim()}".`);
                    setNewAssetItem(""); setNewAssetType(""); setNewAssetOwner(""); setNewAssetDue(""); setNewAssetNotes(""); setNewAssetQty("");
                    fetchAssets();
                  } catch {
                    setAssetMessage("Failed to add asset.");
                  }
                }}
                className="space-y-3"
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={newAssetItem}
                    onChange={(e) => setNewAssetItem(e.target.value)}
                    placeholder="Item name *"
                    required
                    className="flex-1 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                  <input
                    type="number"
                    min="0"
                    value={newAssetQty}
                    onChange={(e) => setNewAssetQty(e.target.value)}
                    placeholder="Qty"
                    className="md:w-20 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value)}
                    className="md:w-36 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  >
                    <option value="">Type</option>
                    <option value="Print">Print</option>
                    <option value="Signage">Signage</option>
                    <option value="Digital">Digital</option>
                    <option value="Swag">Swag</option>
                    <option value="AV">AV</option>
                    <option value="Catering">Catering</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    value={newAssetOwner}
                    onChange={(e) => setNewAssetOwner(e.target.value)}
                    placeholder="Owner"
                    className="md:w-36 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                  <input
                    type="date"
                    value={newAssetDue}
                    onChange={(e) => setNewAssetDue(e.target.value)}
                    className="w-[8.5rem] px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAssetNotes}
                    onChange={(e) => setNewAssetNotes(e.target.value)}
                    placeholder="Notes (optional)"
                    className="flex-1 px-3 py-2.5 border border-gray-200 text-[13px] text-brand-dark font-sans outline-none focus:border-brand-dark transition-colors rounded"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-gold text-white text-[12px] font-sans font-semibold tracking-wide uppercase hover:bg-brand-gold-light transition-colors rounded whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>

            {/* Assets table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              {assetLoading ? (
                <p className="p-6 font-sans text-[14px] text-brand-muted">Loading assets...</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Item</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Type</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Qty</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Owner</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Due Date</th>
                      <th className="px-4 py-3 text-left text-[11px] font-sans font-semibold tracking-wider uppercase text-brand-muted">Notes</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.slice(1).map((row, i) => {
                      const fieldToCol: Record<string, number> = { item: 0, type: 1, quantity: 2, status: 3, owner: 4, dueDate: 5, notes: 6 };
                      const patchField = async (field: string, value: string) => {
                        // Optimistic update — modify local state immediately
                        const colIdx = fieldToCol[field];
                        if (colIdx !== undefined) {
                          setAssets(prev => {
                            const updated = prev.map(r => [...r]);
                            updated[i + 1][colIdx] = value; // +1 to skip header row
                            return updated;
                          });
                        }
                        try {
                          await fetch("/api/events/assets", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ slug: activeSlug, rowIndex: i, field, value }),
                          });
                        } catch {
                          console.error(`Failed to update asset ${field}`);
                          fetchAssets(); // Re-fetch only on failure to restore correct state
                        }
                      };
                      const editableCell = (field: string, colIdx: number, opts?: { type?: string; className?: string; fontWeight?: string }) => (
                        <td className="px-4 py-1">
                          <input
                            type={opts?.type || "text"}
                            defaultValue={row[colIdx] || ""}
                            onBlur={(e) => {
                              if (e.target.value !== (row[colIdx] || "")) patchField(field, e.target.value);
                            }}
                            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                            className={`w-full px-2 py-1.5 text-[13px] font-sans border border-transparent rounded outline-none hover:border-gray-200 focus:border-brand-dark transition-colors ${opts?.className || "text-brand-gray"}`}
                            style={{ fontWeight: opts?.fontWeight || "400" }}
                          />
                        </td>
                      );
                      return (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 min-w-[160px]">
                          {editingItem === i ? (
                            <input
                              autoFocus
                              type="text"
                              defaultValue={row[0] || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (row[0] || "")) patchField("item", e.target.value);
                                setEditingItem(null);
                              }}
                              onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                              className="w-full px-2 py-1.5 text-[13px] font-sans font-medium border border-brand-dark rounded outline-none text-brand-dark"
                            />
                          ) : (
                            <div
                              onClick={() => setEditingItem(i)}
                              className="px-2 py-1.5 text-[13px] font-sans font-medium text-brand-dark cursor-text rounded hover:bg-gray-50 min-h-[28px] whitespace-pre-wrap"
                            >
                              {row[0] || <span className="text-brand-muted">—</span>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-1">
                          <select
                            value={row[1] || ""}
                            onChange={(e) => patchField("type", e.target.value)}
                            className="px-2 py-1.5 text-[12px] font-sans border border-transparent rounded outline-none cursor-pointer hover:border-gray-200 focus:border-brand-dark transition-colors text-brand-gray bg-transparent"
                          >
                            <option value="">—</option>
                            <option value="Print">Print</option>
                            <option value="Signage">Signage</option>
                            <option value="Digital">Digital</option>
                            <option value="Swag">Swag</option>
                            <option value="AV">AV</option>
                            <option value="Catering">Catering</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td className="px-4 py-1 w-20">
                          <input
                            type="number"
                            min="0"
                            defaultValue={row[2] || ""}
                            onBlur={(e) => {
                              if (e.target.value !== (row[2] || "")) patchField("quantity", e.target.value);
                            }}
                            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                            className="w-full px-2 py-1.5 text-[13px] font-sans text-brand-gray border border-transparent rounded outline-none hover:border-gray-200 focus:border-brand-dark transition-colors"
                          />
                        </td>
                        <td className="px-4 py-1">
                          <select
                            value={row[3] || "To Do"}
                            onChange={(e) => patchField("status", e.target.value)}
                            className={`px-2 py-1 text-[12px] font-sans font-medium border rounded outline-none cursor-pointer ${
                              (row[3] || "") === "Approved" ? "border-amber-200 bg-amber-50 text-amber-700" :
                              (row[3] || "") === "In Production" ? "border-purple-200 bg-purple-50 text-purple-700" :
                              (row[3] || "") === "Delivered" ? "border-green-200 bg-green-50 text-green-700" :
                              (row[3] || "") === "In Progress" ? "border-blue-200 bg-blue-50 text-blue-700" :
                              "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Approved">Approved</option>
                            <option value="In Production">In Production</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        {editableCell("owner", 4)}
                        {editableCell("dueDate", 5, { type: "date" })}
                                                <td className="px-4 py-2 min-w-[180px]">
                          {editingNote === i ? (
                            <textarea
                              autoFocus
                              defaultValue={row[6] || ""}
                              onBlur={(e) => {
                                if (e.target.value !== (row[6] || "")) patchField("notes", e.target.value);
                                setEditingNote(null);
                              }}
                              rows={3}
                              className="w-full px-2 py-1.5 text-[13px] font-sans border border-brand-dark rounded outline-none resize-none text-brand-gray"
                            />
                          ) : (
                            <div
                              onClick={() => setEditingNote(i)}
                              className="px-2 py-1.5 text-[13px] font-sans text-brand-gray cursor-text rounded hover:bg-gray-50 min-h-[28px] whitespace-pre-wrap"
                            >
                              {row[6] || <span className="text-brand-muted">—</span>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              if (!activeSlug || !confirm(`Remove "${row[0]}"?`)) return;
                              try {
                                await fetch("/api/events/assets", {
                                  method: "DELETE",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ slug: activeSlug, rowIndex: i }),
                                });
                                fetchAssets();
                              } catch {
                                console.error("Failed to remove asset");
                              }
                            }}
                            className="text-[11px] font-sans text-red-400 hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            &#10005;
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                    {assets.length <= 1 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center font-sans text-[14px] text-brand-muted">
                          No assets yet. Add items above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <p className="mt-3 font-sans text-[12px] text-brand-muted">
              {assets.length > 1 ? assets.length - 1 : 0} assets total
            </p>
          </>
        ) : (
          <p className="text-brand-gray font-sans text-[14px]">No events found.</p>
        )}
      </div>
    </div>
  );
}
