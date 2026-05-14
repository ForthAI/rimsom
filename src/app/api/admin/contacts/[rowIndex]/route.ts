import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import {
  deleteContact,
  updateContact,
  DuplicateEmailError,
  ContactNotFoundError,
  ContactInput,
} from "@/lib/contacts";

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

function parseRowIndex(raw: string): number | null {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 2) return null; // row 1 is the header
  return n;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ rowIndex: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { rowIndex: rowIndexStr } = await context.params;
  const rowIndex = parseRowIndex(rowIndexStr);
  if (!rowIndex) {
    return NextResponse.json({ error: "Invalid row index." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const priorEmail = (body.priorEmail || "").toString().toLowerCase().trim();
    if (!priorEmail) {
      return NextResponse.json({ error: "priorEmail is required." }, { status: 400 });
    }
    const input = normalizeInput(body);
    if (!input.email || !EMAIL_RE.test(input.email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const contact = await updateContact(rowIndex, priorEmail, input);
    return NextResponse.json({ contact });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json(
        { error: "A contact with this email already exists." },
        { status: 409 }
      );
    }
    if (error instanceof ContactNotFoundError) {
      return NextResponse.json(
        { error: "Contact not found at that row — list may be stale." },
        { status: 404 }
      );
    }
    console.error("Update contact error:", error);
    return NextResponse.json({ error: "Failed to update contact." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ rowIndex: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { rowIndex: rowIndexStr } = await context.params;
  const rowIndex = parseRowIndex(rowIndexStr);
  if (!rowIndex) {
    return NextResponse.json({ error: "Invalid row index." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const priorEmail = (body.priorEmail || "").toString().toLowerCase().trim();
    if (!priorEmail) {
      return NextResponse.json({ error: "priorEmail is required." }, { status: 400 });
    }

    await deleteContact(rowIndex, priorEmail);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      return NextResponse.json(
        { error: "Contact not found at that row — list may be stale." },
        { status: 404 }
      );
    }
    console.error("Delete contact error:", error);
    return NextResponse.json({ error: "Failed to delete contact." }, { status: 500 });
  }
}
