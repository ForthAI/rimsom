import { EventConfig } from "@/types/events";

export const events: EventConfig[] = [
  {
    slug: "namibia-convening",
    name: "Namibia Economic Resilience & Investment Convening",
    tagline: "Rimsom Global Presents",
    headline: "RSVP",
    subhead: "Namibia Economic Resilience & Investment Convening",
    description:
      "Join Rimsom Global for a focused convening on economic resilience and investment opportunities in Namibia. An afternoon of strategic dialogue with leaders in trade, finance, and international development.",
    date: "Tuesday, April 14, 2026",
    time: "3:00 PM – 5:00 PM",
    venueName: "1717 K Street NW, 9th Floor",
    venueAddress: "1717 K Street NW, 9th Floor, Washington, DC 20006",
    heroImage: "/boardroom.jpg",
    formFields: [
      { name: "firstName", label: "First Name", type: "text", placeholder: "First name", required: true },
      { name: "surname", label: "Surname", type: "text", placeholder: "Surname", required: true },
      { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
      { name: "title", label: "Title", type: "text", placeholder: "Your title", required: false },
      { name: "organization", label: "Organization", type: "text", placeholder: "Your organization", required: false },
    ],
    confirmationHeadline: "You're Confirmed",
    confirmationText:
      "We look forward to welcoming you. A confirmation email has been sent with event details.",
    googleSheetId: "1Nz12XlXnTbS-BZLcB6Il79cCVuzIV0k-wCSr2NjZ-oY",
    sheetTabName: "Invites",
    rsvpTabName: "RSVPs",
    emailSubject: "Your RSVP is Confirmed – Namibia Economic Resilience & Investment Convening",
    inviteLayout: true,
    inviteLabel: "Official Invitation",
    inviteLocationLabel: "Downtown Washington, D.C.",
    locationNote: "Venue details to be provided upon RSVP confirmation",
    featuredSpeakers: [
      { name: "Hon. Ericah Shafudah", title: "Minister of Finance, Republic of Namibia" },
      { name: "Mr. Ebson Uanguta", title: "Governor, Bank of Namibia" },
    ],
    active: true,
  },
  {
    slug: "finance-after-hours",
    name: "Finance After Hours",
    tagline: "Rimsom Global Presents",
    headline: "RSVP",
    subhead: "Finance After Hours",
    description:
      "An evening reception bringing together leaders in finance, investment, and international development for meaningful conversation and connection.",
    date: "Wednesday, April 15, 2026",
    time: "7:30 PM – 10:30 PM",
    venueName: "Lagos District Restaurant",
    venueAddress: "1629 K Street NW, Washington, D.C. 20006",
    heroImage: "/after-hours.jpg",
    formFields: [
      { name: "firstName", label: "First Name", type: "text", placeholder: "First name", required: true },
      { name: "surname", label: "Surname", type: "text", placeholder: "Surname", required: true },
      { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
      { name: "title", label: "Title", type: "text", placeholder: "Your title", required: false },
      { name: "organization", label: "Organization", type: "text", placeholder: "Your organization", required: false },
    ],
    confirmationHeadline: "You're Confirmed",
    confirmationText:
      "We look forward to welcoming you. A confirmation email has been sent with event details.",
    googleSheetId: "1-1sAMpVvg77pG4-kYbnlLnNXePeSqkl37MUJVjN3LsM",
    sheetTabName: "Invites",
    rsvpTabName: "RSVPs",
    emailSubject: "Your RSVP is Confirmed – Finance After Hours",
    inviteLayout: true,
    inviteLabel: "Strictly By Invitation Only",
    inviteLocationLabel: "Washington, D.C.",
    locationNote: "Exact venue details will be provided upon RSVP confirmation.",
    active: true,
  },
  {
    slug: "sample-reception",
    name: "Sample Reception",
    tagline: "Rimsom Global Presents",
    headline: "RSVP",
    subhead: "An Evening of Strategic Dialogue",
    description:
      "Join Rimsom Global for an intimate gathering of leaders in trade, finance, and international development.",
    date: "Thursday, May 15, 2026",
    time: "6:30 PM – 9:00 PM",
    venueName: "The Hay-Adams Hotel",
    venueAddress: "800 16th St NW, Washington, DC 20006",
    heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
    formFields: [
      { name: "firstName", label: "First Name", type: "text", placeholder: "First name", required: true },
      { name: "surname", label: "Surname", type: "text", placeholder: "Surname", required: true },
      { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
      { name: "title", label: "Title", type: "text", placeholder: "Your title", required: false },
      { name: "organization", label: "Organization", type: "text", placeholder: "Your organization", required: false },
    ],
    confirmationHeadline: "You're Confirmed",
    confirmationText:
      "We look forward to welcoming you. A confirmation email has been sent with event details.",
    googleSheetId: "1gHtu3yA27AjVhYnl47HqmnQi-D6AcN8TqBxYhfl9UKs",
    sheetTabName: "Invites",
    rsvpTabName: "RSVPs",
    emailSubject: "Your RSVP is Confirmed – Rimsom Global",
    active: false,
  },
];

export function getEventBySlug(slug: string): EventConfig | undefined {
  return events.find((e) => e.slug === slug && e.active);
}

export function getAllActiveEvents(): EventConfig[] {
  return events.filter((e) => e.active);
}
