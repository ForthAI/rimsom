export interface EventFormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface EventConfig {
  slug: string;
  name: string;
  tagline: string;
  headline: string;
  subhead: string;
  description: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  heroImage: string;
  formFields: EventFormField[];
  confirmationHeadline: string;
  confirmationText: string;
  googleSheetId: string;
  sheetTabName: string;
  rsvpTabName: string;
  emailSubject: string;
  ticketPdf?: string;
  inviteLayout?: boolean;
  inviteLabel?: string;
  inviteLocationLabel?: string;
  locationNote?: string;
  featuredSpeakers?: { name: string; title: string }[];
  active: boolean;
}

export interface RsvpSubmission {
  eventSlug: string;
  email: string;
  fields: Record<string, string>;
}
