import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getAllActiveEvents, getEventBySlug } from "@/config/events";
import { getAllRsvps, getInviteCount } from "@/lib/google-sheets";

const ADMIN_COOKIE = "rimsom_admin_token";
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || "changeme";

function generateToken(): string {
  const payload = `${Date.now()}_${crypto.randomUUID()}`;
  const hmac = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

function validateToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  if (sig !== expected) return false;
  // Check token age (24 hours)
  const timestamp = parseInt(payload.split("_")[0], 10);
  return Date.now() - timestamp < 24 * 60 * 60 * 1000;
}

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
    const eventsToFetch = slug
      ? [getEventBySlug(slug)].filter(Boolean)
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
