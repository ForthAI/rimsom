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
