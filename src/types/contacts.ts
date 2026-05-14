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
  ccOf: string;
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
}

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
