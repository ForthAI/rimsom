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
