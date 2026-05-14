# Event System Debrief — Namibia Roundtable & Finance After Hours (Q1 2026)

Post-mortem on the first two events run through the system. Goal: understand what worked, what broke, and what to change before the next event cycle (virtual event soon + UNGA event in NYC in September).

---

## What Worked

- **System and event pages looked professional and held up under use.** No outages, no data loss, no broken flows.
- **Status dropdowns on the invite list were the unsung hero.** Toggling between the admin panel and Outlook with color-coded statuses (Working / Sent / Bounced / Hold / Test) was the single most important feature for keeping track of where each invitee was in the process.
- **Click-to-copy on email, CC, name fields.** Compressed the copy-paste loop between admin panel and Outlook.
- **Location-on-registration gate.** Technically worked well. Value to invitees unclear — we don't know if anyone consciously noticed or appreciated it.
- **The admin-panel-first workflow saved the event.** Matt was the only person using it; without it, there was no realistic way the client would have run these events on their own.

## What Broke or Caused Pain

### 1. Timing mismatch between system and content
System was ready well before the invitee list was. "System-ready" and "event-ready" are not the same thing. We had polished pages and admin tools sitting idle while emails trickled in closer to the event.

### 2. Email as the sole primary key was too rigid
- Some invitees came with CCs (spouses, schedulers, chiefs of staff) who needed to receive the invite but were not themselves invited.
- Some of those CCs were schedulers who replied on behalf of the invitee.
- The system treated email as a unique identity — it didn't model "this person has helpers" or "this email address is a proxy for another person."

### 3. Email replies used as RSVPs
A meaningful number of people replied directly to the invitation email instead of clicking through to the RSVP page. That forced constant Outlook monitoring and manual data entry back into the system. The RSVP page was optional from the invitee's perspective.

### 4. Honorifics / salutations were an all-or-nothing problem
- Ambassadors need "Excellency." Others would feel odd getting "Mr."/"Ms."
- We ended up with two versions of the Namibia email to handle this.
- The VIP star was introduced to flag these cases — it was never used in practice.
- Root cause: salutation logic needed to be per-contact, not per-email-template.

### 5. Inbound chaos (WhatsApp, email, verbal, late additions)
New invitees and RSVPs came in through multiple uncontrolled channels. Each one had to be manually reconciled into the sheet. No single inbox, no structured intake.

### 6. RSVP deadline changes
Driven by low acceptance rates and fear of losing people who thought it was "too late." This is not a tool failure — this is event reality. The tool needs to **make deadline changes painless**, not try to prevent them.

### 7. Ambassador guest list request
Late in the cycle, the client needed to send the Ambassador a list of everyone invited (including non-responders) because we knew some attendees had decided to come without formally RSVP'ing. We had no clean export for "all invited, regardless of RSVP status."

### 8. Name tags — low yield
- Namibia roundtable: worked OK (smaller, more formal).
- Finance After Hours: many unclaimed, many people wrote their own.
- Open question: **is the name tag workflow worth the effort for casual/networking events?** Possibly only worth it for formal seated events.

### 9. Single-operator system
Matt was the only user. The system was built *for* the client but the client never operated it. This is a fact, not necessarily a bug — but it means any "they can use it themselves" assumption is wrong. Design should optimize for Matt being the operator.

### 10. Client chaos amplified everything
Client is naturally chaotic. Any system needs to absorb that rather than fight it — late additions, deadline changes, and "send me a list of X" requests are going to keep happening. The question is whether the tool makes those 2-minute tasks or 30-minute tasks.

---

## Root Cause Categorization

| Category | Examples |
|---|---|
| **Tooling gap** | Email-as-primary-key rigidity, no honorific field, no "everyone invited" export, no email-reply ingestion, no unified inbox |
| **Process gap** | No canonical intake channel for late additions (WhatsApp / email / verbal all flowing in), no rule for when to stop accepting new invites |
| **Decision gap** | Deadline shifts driven by anxiety rather than data, VIP star concept introduced but never operationalized |

---

## Principles for the Next System

1. **Events never go according to plan — the tool must absorb chaos, not resist it.** Late adds, deadline changes, and ad-hoc list exports are the norm. Design around them.
2. **Matt is the operator. Optimize for Matt.** Not for the client, not for "ideal workflow." For the actual human running the thing at 11pm the night before.
3. **Email is a channel, not an identity.** Contacts are identities. Contacts can have multiple email addresses, CCs, proxies, and schedulers.
4. **Every "manual reconciliation step" is a design smell.** If Matt is copy-pasting between Outlook and the admin panel, that's a gap.

---

## Candidate Changes for the Next Event

Draft list — to be prioritized before UNGA planning kicks off.

### High-value, low-effort
- **"All invited" export** (regardless of RSVP status) — needed this once, will need it again.
- **Per-contact honorific field** (Mr. / Ms. / Excellency / Dr. / Hon. / none) — drives email template salutation automatically.
- **Make the VIP star actually do something** — e.g., filter view, separate section on door list, different email template.
- **Mark-as-attending based on email reply** — Matt already does this mentally; a one-click "mark as yes, send confirmation" from a row would remove friction.

### Medium-effort
- **Central contacts database** (already in FUTURE.md). Crucial because UNGA invitees will substantially overlap with Namibia + Finance AH attendees.
- **Contact tags** for segmenting: `namibia-attended`, `finance-ah-attended`, `virtual-interested`, `unga-target`, `ambassador`, etc.
- **Followup tracking** — who have we not touched since their last event.
- **CC / proxy model on contacts** — a contact can have 1+ email addresses, with roles: `primary`, `cc`, `scheduler`.

### Open questions (not yet decisions)
- Do we build an **email-reply-as-RSVP** intake? (e.g., a parsing inbox that matches replies back to invitees.) High value but real engineering work.
- Do we keep the **location-reveal-on-registration** feature? Unclear if it provided value.
- Is there a lighter version of **name tags** for casual events — or do we skip them entirely for networking-style gatherings?
- Should the system have a concept of **event type** (formal seated vs. casual networking) that unlocks/hides features like name tags, salutations, door lists?

---

## Reality Check for UNGA Planning

UNGA is a harder version of what we just did:
- More prestigious attendees → honorifics matter more
- NYC in September → venue logistics, travel coordination
- Likely higher-profile invitees → even more scheduler proxies and CCs
- Likely longer lead time but more churn in the list

If the current system felt messy for Finance After Hours, it will feel significantly worse for UNGA without the Phase 1 contacts database and the honorific/CC model.

**Recommendation:** Before the next virtual event, ship the "low-effort high-value" list above. Before UNGA, ship the central contacts database and tags. Treat the virtual event as the pilot for the new contact model.

---

*Debrief captured: 2026-04-21. Source: post-event conversation with Matt after Finance After Hours.*
