"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Contact } from "@/types/contacts";

type SortKey = "name" | "organization";
type SortDir = "asc" | "desc";

export default function ContactsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // On mount, attempt the fetch — a 200 means the auth cookie is valid.
  const loadContacts = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error || "Failed to load contacts.");
        return;
      }
      setContacts(data.contacts || []);
      setAuthenticated(true);
    } catch {
      setFetchError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/events/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.message || "Invalid password.");
      } else {
        setPassword("");
        await loadContacts();
      }
    } catch {
      setAuthError("Something went wrong. Try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  // Filter + sort
  const search_lc = search.trim().toLowerCase();
  const filtered = contacts.filter((c) => {
    if (!search_lc) return true;
    return (
      c.firstName.toLowerCase().includes(search_lc) ||
      c.surname.toLowerCase().includes(search_lc) ||
      c.email.toLowerCase().includes(search_lc) ||
      c.organization.toLowerCase().includes(search_lc) ||
      c.ccOf.toLowerCase().includes(search_lc)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name") {
      const aName = `${a.surname} ${a.firstName}`.toLowerCase();
      const bName = `${b.surname} ${b.firstName}`.toLowerCase();
      return aName.localeCompare(bName) * dir;
    }
    return a.organization.toLowerCase().localeCompare(b.organization.toLowerCase()) * dir;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return null;
    return <span className="ml-1 text-white/40">{sortDir === "asc" ? "▲" : "▼"}</span>;
  }

  // Login screen — same look as the existing per-event admin login.
  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-brand-navy flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <Image src="/logo-white.svg" alt="Rimsom Global" width={140} height={44} className="h-10 w-auto mx-auto mb-6" />
            <p className="text-[11px] font-sans font-semibold tracking-widest-plus uppercase text-white/40">
              Contact Administration
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

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50">
      {/* Page header — sits below AdminHeader from layout */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-content mx-auto px-6 md:px-10 py-6">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-sans text-[22px] font-semibold text-gray-900">Master Contacts</h1>
              <p className="font-sans text-[13px] text-gray-500 mt-1">
                {loading
                  ? "Loading…"
                  : search
                    ? `${sorted.length} of ${contacts.length} contacts`
                    : `${contacts.length} contacts`}
              </p>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, organization…"
              className="w-full md:w-80 px-3 py-2 bg-white border border-gray-300 text-[13px] font-sans outline-none focus:border-gray-900 rounded"
            />
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-6">
        {fetchError && (
          <div className="mb-6 p-4 border-l-2 border-red-500 bg-red-50">
            <p className="font-sans text-[14px] text-red-700">{fetchError}</p>
          </div>
        )}

        {!loading && sorted.length === 0 && !fetchError && (
          <div className="bg-white border border-gray-200 rounded p-12 text-center">
            <p className="font-sans text-[14px] text-gray-500">
              {search ? "No contacts match your search." : "No contacts yet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-[12px] font-sans text-gray-700 hover:text-gray-900 underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {sorted.length > 0 && (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-[13px] font-sans">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th
                    onClick={() => toggleSort("name")}
                    className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase cursor-pointer hover:bg-gray-800 select-none"
                  >
                    Name {sortIndicator("name")}
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase">Title</th>
                  <th
                    onClick={() => toggleSort("organization")}
                    className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase cursor-pointer hover:bg-gray-800 select-none"
                  >
                    Organization {sortIndicator("organization")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => {
                  const fullName = [c.firstName, c.surname].filter(Boolean).join(" ") || "—";
                  return (
                    <tr key={`${c.rowIndex}-${c.email}`} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-900">
                        {c.honorific ? <span className="text-gray-500">{c.honorific} </span> : null}
                        {fullName}
                        {c.ccOf && (
                          <span className="ml-2 text-[10px] tracking-wider uppercase text-gray-400">cc of {c.ccOf}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <a href={`mailto:${c.email}`} className="text-gray-700 hover:text-gray-900 underline">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700">{c.title || "—"}</td>
                      <td className="px-4 py-2.5 text-gray-700">{c.organization || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
