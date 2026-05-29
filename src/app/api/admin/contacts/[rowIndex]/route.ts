import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import {
  deleteContact,
  updateContact,
  DuplicateEmailError,
  ContactNotFoundError,
} from "@/lib/contacts";
import { normalizeContactInput, EMAIL_RE } from "@/lib/contacts-normalize";

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
    // priorEmail may be empty for contacts that were saved without one.
    const priorEmail = (body.priorEmail || "").toString().toLowerCase().trim();
    const input = normalizeContactInput(body);
    // Email is optional — but if present, must look like an email.
    if (input.email && !EMAIL_RE.test(input.email)) {
      return NextResponse.json({ error: "Email format is invalid." }, { status: 400 });
    }
    if (!input.email && !input.firstName && !input.surname) {
      return NextResponse.json(
        { error: "Add an email or at least a name." },
        { status: 400 }
      );
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
    // priorEmail may be empty for emailless contacts.
    const priorEmail = (body.priorEmail || "").toString().toLowerCase().trim();

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
