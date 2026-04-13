"use client";

import { useState, useEffect, useRef } from "react";

const SITE_PASSWORD = "rimsom2026";
const STORAGE_KEY = "rimsom_site_unlocked";

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!unlocked && !checking) {
      inputRef.current?.focus();
    }
  }, [unlocked, checking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  if (checking) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          maxWidth: 360,
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Rimsom Global
        </p>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="Enter password"
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 4,
            color: "#fff",
            fontSize: 14,
            outline: "none",
            textAlign: "center",
            letterSpacing: "0.1em",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
        />
        {error && (
          <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>
        )}
        <button
          type="submit"
          style={{
            padding: "12px 40px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            color: "rgba(255,255,255,0.7)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}
