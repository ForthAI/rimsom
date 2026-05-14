import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import { listContacts } from "@/lib/contacts";

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const contacts = await listContacts();
    return NextResponse.json({
      contacts,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts." },
      { status: 500 }
    );
  }
}
