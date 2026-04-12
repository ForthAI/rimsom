# Future Updates

## Outlook Email Send Workflow
Connect the admin invite panel to a Microsoft 365 Outlook account via Microsoft Graph API so invitations can be sent directly from the admin dashboard.

**Approach:** Microsoft Graph API with OAuth
- Authenticate once via OAuth, store refresh token
- Send personalized HTML invitation emails from your real Outlook account (e.g. events@rimsomglobal.com)
- Emails appear in your Sent folder, replies come back to your inbox
- Status auto-updates to "Sent" with timestamp after each send

**Workflow:**
- Select invites in admin table (individual or "Send All Unsent")
- Click Send — emails go out using a branded HTML template with invitee details
- Status flips to "Sent" automatically
- Bounce tracking via Graph webhooks
- Optional: open/click tracking

**Why Graph over transactional senders:**
Invitees are ambassadors and senior officials — emails from a real Outlook account with your domain carry more weight than a transactional no-reply address. Plus you get threading, reply handling, and team visibility in a shared mailbox.

**Estimated effort:** 1-2 days

---

## Multi-Provider Email Architecture (Product-Ready)
If this becomes a multi-tenant product, abstract email sending behind a provider interface so each org can connect their own email platform.

**Architecture:**
Define a common interface — `sendInvite(to, template, data)` — with provider adapters behind it. The admin panel workflow stays identical regardless of which provider is connected.

**Providers:**
1. **SMTP** — universal fallback, works with virtually any email platform (Exchange, Yahoo, custom domains)
2. **Microsoft Graph** — Outlook/M365, OAuth-based, primary audience likely uses this
3. **Gmail API** — Google Workspace orgs, OAuth-based
4. **Transactional fallback (Resend)** — for orgs that just want it to work without connecting anything

**Multi-tenant setup:**
- Org settings page: "Connect Email" with OAuth flow for M365 or Google, or SMTP credentials
- Store tokens/credentials per org, encrypted
- Send workflow is identical regardless of provider
- Adding a new provider = writing one adapter; UI, templates, status tracking, and workflow all stay the same

**Build priority:** SMTP first (widest coverage) → Microsoft Graph → Gmail API → Resend fallback

**Estimated effort:** 3-5 days for the abstraction layer + first two providers

---

## Central Contacts Database

After each event, attendee data should flow into a master contacts list that grows over time and becomes the source of truth for future invitations.

**How it works:**
- A **Contacts** table stores every person across all events — name, title, organization, email
- After an event, a merge process matches by email address:
  - New person → create contact
  - Existing person → update their name/title/org with the latest RSVP form data (self-reported = most accurate)
- Each contact is tagged with events they attended (e.g. "Finance After Hours – Apr 2026")

**Why RSVP form data wins:**
The invite list has what *you* know about someone. The RSVP form has what *they* say about themselves. Titles change, organizations change — the most recent self-reported data is the most reliable.

**Estimated effort:** 1-2 days

---

## Contact Tags & Event Invite Import

A lightweight tagging system on top of the contacts database so you can quickly build invite lists for recurring events without adding people one by one.

**How it works:**
- Each contact can have one or more tags (e.g. "Finance After Hours", "Namibia", "All Events", "VIP")
- Tags are simple text labels — no complex hierarchy, no automation
- When creating a new event, a button says "Import from contacts" and lets you pick by tag
- Selected contacts get added to the event's invite list in one click
- You can still add/remove individuals after the import

**Example workflow:**
1. Monthly "Finance After Hours" event created
2. Click "Import from contacts" → select tag "Finance After Hours"
3. 40 contacts auto-populate the invite list
4. Add 5 new people manually, remove 2 who declined last time
5. Send invitations

**Design principle:** No automation, no rules engine. Just contacts + tags + a quick import. Simple enough that it replaces a spreadsheet, not complex enough that it needs training.

**Estimated effort:** 2-3 days (on top of Contacts Database)
