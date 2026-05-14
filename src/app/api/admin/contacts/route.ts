import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import {
  appendContact,
  listContacts,
  DuplicateEmailError,
  ContactInput,
} from "@/lib/contacts";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeInput(raw: Partial<ContactInput>): ContactInput {
  return {
    email: (raw.email || "").toString().toLowerCase().trim(),
    honorific: (raw.honorific || "").toString().trim(),
    firstName: (raw.firstName || "").toString().trim(),
    surname: (raw.surname || "").toString().trim(),
    title: (raw.title || "").toString().trim(),
    organization: (raw.organization || "").toString().trim(),
    ccOf: (raw.ccOf || "").toString().toLowerCase().trim(),
    notes: (raw.notes || "").toString(),
    lastContacted: (raw.lastContacted || "").toString().trim(),
    phone: (raw.phone || "").toString().trim(),
    address: (raw.address || "").toString().trim(),
    website: (raw.website || "").toString().trim(),
  };
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const input = normalizeInput(body);
    if (!input.email || !EMAIL_RE.test(input.email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const contact = await appendContact(input);
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json(
        { error: "A contact with this email already exists." },
        { status: 409 }
      );
    }
    console.error("Create contact error:", error);
    return NextResponse.json({ error: "Failed to create contact." }, { status: 500 });
  }
}
