import { EventConfig } from "@/types/events";

export const events: EventConfig[] = [
  {
    slug: "sample-reception",
    name: "Sample Reception",
    tagline: "Rimsom Global Presents",
    headline: "You're Invited",
    subhead: "An Evening of Strategic Dialogue",
    description:
      "Join Rimsom Global for an intimate gathering of leaders in trade, finance, and international development. An evening designed for meaningful connection and strategic conversation.",
    date: "Thursday, May 15, 2026",
    time: "6:30 PM – 9:00 PM",
    venueName: "The Hay-Adams Hotel",
    venueAddress: "800 16th St NW, Washington, DC 20006",
    heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", placeholder: "Your full name", required: true },
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
    active: true,
  },
];

export function getEventBySlug(slug: string): EventConfig | undefined {
  return events.find((e) => e.slug === slug && e.active);
}

export function getAllActiveEvents(): EventConfig[] {
  return events.filter((e) => e.active);
}
