import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllActiveEvents, getEventBySlugAnyStatus } from "@/config/events";
import { getAllRsvps, getInviteCount } from "@/lib/google-sheets";
import { ADMIN_COOKIE, generateToken, validateToken } from "@/lib/admin-auth";

// POST: authenticate
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { authenticated: false, message: "Invalid password." },
        { status: 401 }
      );
    }

    const token = generateToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { authenticated: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}

// GET: fetch RSVP data
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;

    if (!token || !validateToken(token)) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const slug = req.nextUrl.searchParams.get("slug");
    // Admin uses `getEventBySlugAnyStatus` so past (inactive) events are still
    // viewable in the admin. Public/RSVP routes still use `getEventBySlug`.
    const eventsToFetch = slug
      ? [getEventBySlugAnyStatus(slug)].filter(Boolean)
      : getAllActiveEvents();

    const results = await Promise.all(
      eventsToFetch.map(async (event) => {
        if (!event) return null;
        try {
          const rsvps = await getAllRsvps(event.googleSheetId, event.rsvpTabName);
          const inviteCount = await getInviteCount(event.googleSheetId, event.sheetTabName);
          return {
            slug: event.slug,
            name: event.name,
            date: event.date,
            venueName: event.venueName,
            inviteCount,
            headers: rsvps[0] || [],
            rsvps: rsvps.slice(1),
          };
        } catch {
          return { slug: event.slug, name: event.name, date: event.date, error: "Failed to fetch data" };
        }
      })
    );

    return NextResponse.json({ events: results.filter(Boolean) });
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
