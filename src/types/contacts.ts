/**
 * A single contact in the master Rimsom contacts sheet.
 * `rowIndex` is the 1-based Google Sheet row (header is row 1, first data row is 2).
 * It's only stable within a single fetch; deletes shift indices.
 */
export interface Contact {
  rowIndex: number;
  email: string;
  honorific: string;
  firstName: string;
  surname: string;
  title: string;
  organization: string;
  ccOf: string;
  notes: string;
  lastContacted: string;
  phone: string;
  address: string;
  website: string;
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
