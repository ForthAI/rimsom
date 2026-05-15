import { ContactInput } from "./contacts";

/** Trim + coerce all fields from an untrusted JSON body. */
export function normalizeContactInput(raw: Partial<ContactInput>): ContactInput {
  const s = (v: unknown) => (v ?? "").toString();
  return {
    email: s(raw.email).toLowerCase().trim(),
    honorific: s(raw.honorific).trim(),
    firstName: s(raw.firstName).trim(),
    surname: s(raw.surname).trim(),
    title: s(raw.title).trim(),
    organization: s(raw.organization).trim(),
    notes: s(raw.notes),
    lastContacted: s(raw.lastContacted).trim(),
    phoneCountry: s(raw.phoneCountry).trim(),
    phone: s(raw.phone).trim(),
    whatsapp: s(raw.whatsapp).trim(),
    linkedin: s(raw.linkedin).trim(),
    website: s(raw.website).trim(),
    addressLine1: s(raw.addressLine1).trim(),
    addressLine2: s(raw.addressLine2).trim(),
    city: s(raw.city).trim(),
    state: s(raw.state).trim(),
    postalCode: s(raw.postalCode).trim(),
    country: s(raw.country).trim(),
    secondaryEmail: s(raw.secondaryEmail).toLowerCase().trim(),
    schedulerName: s(raw.schedulerName).trim(),
    schedulerEmail: s(raw.schedulerEmail).toLowerCase().trim(),
    additionalEmails: s(raw.additionalEmails).toLowerCase().trim(),
    status: (s(raw.status).trim() as ContactInput["status"]) || "",
  };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
