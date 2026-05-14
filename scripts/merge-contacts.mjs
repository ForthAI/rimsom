#!/usr/bin/env node
/**
 * One-shot contact merge script.
 *
 * Pulls Invites + RSVPs tabs for each real event, dedupes by email,
 * applies "RSVP form data wins over invite data" rule, tags contacts
 * with which events they were invited to / attended / declined / pending,
 * and writes a master CSV to scripts/output/contacts-master.csv.
 *
 * Usage:
 *   node --env-file=.env.local scripts/merge-contacts.mjs
 *
 * No writes to Google Sheets. Pure read + local CSV output.
 */

import { google } from "googleapis";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "output");

// Mirror src/config/events.ts (keep in sync if sheets change)
const EVENTS = [
  {
    slug: "namibia-convening",
    label: "Namibia",
    googleSheetId: "1Nz12XlXnTbS-BZLcB6Il79cCVuzIV0k-wCSr2NjZ-oY",
    inviteTab: "Invites",
    rsvpTab: "RSVPs",
  },
  {
    slug: "finance-after-hours",
    label: "FinanceAH",
    googleSheetId: "1-1sAMpVvg77pG4-kYbnlLnNXePeSqkl37MUJVjN3LsM",
    inviteTab: "Invites",
    rsvpTab: "RSVPs",
  },
];

function getCredentials() {
  const raw = process.env.GOOGLE_CREDENTIALS;
  if (raw) return JSON.parse(raw);
  const key = process.env.GOOGLE_PRIVATE_KEY || "";
  return {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: key.includes("\\n") ? key.replace(/\\n/g, "\n") : key,
  };
}

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: getCredentials(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}

async function fetchTab(sheets, sheetId, tabName) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A:Z`,
  });
  const rows = res.data.values || [];
  if (rows.length === 0) return { header: [], rows: [] };
  const header = rows[0].map((h) => (h || "").trim());
  const dataRows = rows.slice(1).filter((r) => (r[0] || "").trim() !== "");
  return { header, rows: dataRows };
}

function rowToObject(header, row) {
  const obj = {};
  header.forEach((h, i) => {
    obj[h] = (row[i] || "").trim();
  });
  return obj;
}

function pickEmail(obj) {
  // Try common header names
  for (const key of Object.keys(obj)) {
    if (/^email$/i.test(key)) return obj[key].toLowerCase().trim();
  }
  return "";
}

function pickField(obj, names) {
  for (const key of Object.keys(obj)) {
    for (const n of names) {
      if (key.toLowerCase() === n.toLowerCase()) return obj[key];
    }
  }
  return "";
}

function csvEscape(v) {
  const s = (v ?? "").toString();
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows, columns) {
  const lines = [columns.join(",")];
  for (const r of rows) {
    lines.push(columns.map((c) => csvEscape(r[c])).join(","));
  }
  return lines.join("\n") + "\n";
}

async function main() {
  const sheets = getSheets();
  // contacts keyed by lowercased email
  const contacts = new Map();

  // Track per-event status for each email
  // status values: 'invited' | 'yes' | 'no' | 'pending' | 'cc' (cc'd but not primary invitee)
  function ensure(email) {
    if (!contacts.has(email)) {
      contacts.set(email, {
        email,
        firstName: "",
        surname: "",
        title: "",
        organization: "",
        source: "", // 'rsvp' or 'invite'
        ccOf: "", // if this email appeared as a CC, who was the primary
        guests: "",
        events: {}, // { Namibia: {invited: true, status: 'yes', ...}, ... }
        rawHeaders: new Set(),
      });
    }
    return contacts.get(email);
  }

  // Helper: merge name/title/org from a source row into the canonical contact.
  // Rule: RSVP-source data wins over Invite-source data. Don't overwrite RSVP with Invite.
  function applyFields(c, fields, source) {
    const wins = source === "rsvp" || c.source !== "rsvp";
    const writeIfBetter = (k, v) => {
      if (!v) return;
      if (!c[k] || wins) c[k] = v;
    };
    writeIfBetter("firstName", fields.firstName);
    writeIfBetter("surname", fields.surname);
    writeIfBetter("title", fields.title);
    writeIfBetter("organization", fields.organization);
    if (source === "rsvp") c.source = "rsvp";
    else if (!c.source) c.source = "invite";
  }

  for (const ev of EVENTS) {
    console.log(`\n=== ${ev.label} (${ev.slug}) ===`);

    // Invites
    const invites = await fetchTab(sheets, ev.googleSheetId, ev.inviteTab);
    console.log(`  Invites tab: ${invites.rows.length} rows. Headers: ${invites.header.join(" | ")}`);
    for (const row of invites.rows) {
      const obj = rowToObject(invites.header, row);
      const email = pickEmail(obj);
      if (!email) continue;
      const fields = {
        firstName: pickField(obj, ["First Name", "First", "FirstName"]),
        surname: pickField(obj, ["Surname", "Last Name", "Last", "LastName"]),
        title: pickField(obj, ["Title"]),
        organization: pickField(obj, ["Organization", "Org", "Company"]),
      };
      const cc = pickField(obj, ["CC", "Cc"]);
      const guests = pickField(obj, ["Guests", "Additional Guests"]);
      const status = pickField(obj, ["Status"]).toLowerCase();
      const vip = pickField(obj, ["VIP"]);

      const c = ensure(email);
      applyFields(c, fields, "invite");
      Object.keys(obj).forEach((h) => c.rawHeaders.add(h));
      c.events[ev.label] = c.events[ev.label] || {};
      c.events[ev.label].invited = true;
      c.events[ev.label].inviteStatus = status || "(blank)";
      if (vip) c.events[ev.label].vip = vip;
      if (guests) c.events[ev.label].invitedGuests = guests;

      // CC handling — register each cc'd email as its own contact, tagged as cc-of
      if (cc) {
        const ccEmails = cc
          .split(/[,;\s]+/)
          .map((e) => e.toLowerCase().trim())
          .filter((e) => e.includes("@"));
        for (const ccEmail of ccEmails) {
          const ccContact = ensure(ccEmail);
          if (!ccContact.ccOf) ccContact.ccOf = email;
          ccContact.events[ev.label] = ccContact.events[ev.label] || {};
          ccContact.events[ev.label].ccOnly = true;
        }
      }
    }

    // RSVPs
    const rsvps = await fetchTab(sheets, ev.googleSheetId, ev.rsvpTab);
    console.log(`  RSVPs tab: ${rsvps.rows.length} rows. Headers: ${rsvps.header.join(" | ")}`);
    for (const row of rsvps.rows) {
      const obj = rowToObject(rsvps.header, row);
      const email = pickEmail(obj);
      if (!email) continue;
      const fields = {
        firstName: pickField(obj, ["First Name", "First", "FirstName"]),
        surname: pickField(obj, ["Surname", "Last Name", "Last", "LastName"]),
        title: pickField(obj, ["Title"]),
        organization: pickField(obj, ["Organization", "Org", "Company"]),
      };
      const attending = pickField(obj, ["Attending", "RSVP", "Status", "Response"]).toLowerCase();
      const guestNames = pickField(obj, ["Guest Names", "Guests"]);

      const c = ensure(email);
      applyFields(c, fields, "rsvp");
      Object.keys(obj).forEach((h) => c.rawHeaders.add(h));
      c.events[ev.label] = c.events[ev.label] || {};
      // Heuristic: if attending field exists and looks like 'no'/'declined' -> declined; else yes
      let rsvpStatus = "yes";
      if (/no|declin/.test(attending)) rsvpStatus = "no";
      c.events[ev.label].rsvp = rsvpStatus;
      if (guestNames) c.events[ev.label].guestNames = guestNames;
      // RSVP wins on identity
      c.guests = guestNames || c.guests;
    }
  }

  // Build output rows in master-sheet shape
  const allLabels = EVENTS.map((e) => e.label);
  const outputRows = [];
  for (const c of contacts.values()) {
    const tags = [];
    const row = {
      email: c.email,
      honorific: "", // intentionally blank — to be filled in manually
      firstName: c.firstName,
      surname: c.surname,
      title: c.title,
      organization: c.organization,
      ccOf: c.ccOf,
    };

    for (const label of allLabels) {
      const ev = c.events[label] || {};
      // Only `attended` is encoded as a tag. Invited/declined/cc are not durable signals worth keeping.
      const slug = label.toLowerCase();
      if (ev.rsvp === "yes") tags.push(`${slug}-attended`);
      if (ev.vip && /yes|true|1|★|\*/i.test(ev.vip)) tags.push("vip");
    }

    row.tags = Array.from(new Set(tags)).join(", ");
    row.notes = "";
    row.lastContacted = "";

    outputRows.push(row);
  }

  // Sort: people who attended something first, then alphabetically by surname
  outputRows.sort((a, b) => {
    const aAttended = (a.tags || "").includes("-attended");
    const bAttended = (b.tags || "").includes("-attended");
    if (aAttended !== bAttended) return aAttended ? -1 : 1;
    return (a.surname || "").localeCompare(b.surname || "");
  });

  const columns = [
    "email",
    "honorific",
    "firstName",
    "surname",
    "title",
    "organization",
    "ccOf",
    "tags",
    "notes",
    "lastContacted",
  ];

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const csv = toCsv(outputRows, columns);
  const outPath = resolve(OUTPUT_DIR, "contacts-master.csv");
  writeFileSync(outPath, csv, "utf-8");

  // Summary
  console.log("\n=== SUMMARY ===");
  console.log(`Total unique contacts: ${outputRows.length}`);
  for (const label of allLabels) {
    const slug = label.toLowerCase();
    const attended = outputRows.filter((r) => (r.tags || "").includes(`${slug}-attended`)).length;
    const declined = outputRows.filter((r) => (r.tags || "").includes(`${slug}-declined`)).length;
    const invited = outputRows.filter((r) => (r.tags || "").includes(`${slug}-invited`)).length;
    const ccOnly = outputRows.filter((r) => (r.tags || "").includes(`${slug}-cc`)).length;
    console.log(`  ${label}: ${attended} attended, ${declined} declined, ${invited} invited-no-response, ${ccOnly} cc-only`);
  }
  const overlap = outputRows.filter((r) =>
    allLabels.every((l) => (r.tags || "").includes(l.toLowerCase()))
  ).length;
  console.log(`Contacts touching BOTH events: ${overlap}`);
  console.log(`\nWrote: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
