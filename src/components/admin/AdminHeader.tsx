import Link from "next/link";
import Image from "next/image";
import { getAllActiveEvents, getAllPastEvents } from "@/config/events";

/**
 * Top-level admin navigation. Renders three sections:
 * - Contacts (always)
 * - Active Events (current/upcoming)
 * - Past Events (archived but still viewable)
 *
 * Server component — reads events config directly. Auth-aware navigation
 * happens at the page level: each admin page handles its own auth gate.
 */
export function AdminHeader() {
  const activeEvents = getAllActiveEvents();
  const pastEvents = getAllPastEvents();

  return (
    <header className="bg-black text-white no-print">
      <div className="max-w-content mx-auto px-6 md:px-10 py-3 flex items-center gap-8">
        <Link href="/events/admin/contacts" className="flex items-center gap-3">
          <Image src="/logo-white.svg" alt="Rimsom Global" width={110} height={34} className="h-7 w-auto" />
          <span className="text-[10px] font-sans font-semibold tracking-widest uppercase text-white/40">Admin</span>
        </Link>

        <nav className="flex items-center gap-1 flex-wrap">
          <Link
            href="/events/admin/contacts"
            className="px-3 py-1.5 text-[11px] font-sans font-semibold tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            Contacts
          </Link>

          {activeEvents.length > 0 && (
            <span className="ml-3 mr-1 text-[10px] font-sans tracking-widest uppercase text-white/30">Active</span>
          )}
          {activeEvents.map((ev) => (
            <Link
              key={ev.slug}
              href={`/events/admin/event/${ev.slug}`}
              className="px-3 py-1.5 text-[11px] font-sans font-semibold tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors whitespace-nowrap"
            >
              {ev.name}
            </Link>
          ))}

          {pastEvents.length > 0 && (
            <span className="ml-3 mr-1 text-[10px] font-sans tracking-widest uppercase text-white/30">Past</span>
          )}
          {pastEvents.map((ev) => (
            <Link
              key={ev.slug}
              href={`/events/admin/event/${ev.slug}`}
              className="px-3 py-1.5 text-[11px] font-sans font-semibold tracking-wider uppercase text-white/40 hover:text-white/80 hover:bg-white/5 rounded transition-colors whitespace-nowrap"
            >
              {ev.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
