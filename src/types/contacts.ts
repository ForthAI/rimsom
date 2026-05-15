/**
 * A single contact in the master Rimsom contacts sheet.
 * `rowIndex` is the 1-based Google Sheet row (header is row 1, first data row is 2).
 * It's only stable within a single fetch; deletes shift indices.
 */
export interface Contact {
  rowIndex: number;
  // Identity
  email: string;
  honorific: string;
  firstName: string;
  surname: string;
  // Professional
  title: string;
  organization: string;
  // CRM metadata
  notes: string;
  lastContacted: string;
  // Contact methods
  phoneCountry: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  website: string;
  // Address (structured for international contacts)
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Additional emails — labeled. Most contacts will only have a primary.
  secondaryEmail: string;
  schedulerName: string;
  schedulerEmail: string;
  additionalEmails: string;
  // Follow-up pipeline status.
  status: ContactStatus | "";
}

/** Lifecycle states for follow-up tracking. */
export const CONTACT_STATUSES = [
  "New",
  "Outreach Sent",
  "Connected",
  "Cold",
  "Do Not Contact",
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

/** Display config per status — color + short description. */
export const STATUS_STYLES: Record<ContactStatus, { badge: string; description: string }> = {
  "New": {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Just added — hasn't been reached out to yet",
  },
  "Outreach Sent": {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Email/LinkedIn sent, waiting on reply",
  },
  "Connected": {
    badge: "bg-green-100 text-green-800 border-green-200",
    description: "Replied / accepted / engaged",
  },
  "Cold": {
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    description: "No response after follow-ups",
  },
  "Do Not Contact": {
    badge: "bg-red-100 text-red-800 border-red-200",
    description: "Explicitly off-list",
  },
};

/** Honorific dropdown values. Empty string = "(none)". */
export const HONORIFICS = [
  "",
  "Mr.",
  "Ms.",
  "Mx.",
  "Dr.",
  "Hon.",
  "The Honorable",
  "Excellency",
  "Amb.",
  "Prof.",
] as const;

export type Honorific = (typeof HONORIFICS)[number];
