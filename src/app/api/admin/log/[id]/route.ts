import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin-auth";
import { deleteLog, updateLog, LogNotFoundError } from "@/lib/log";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const body = await req.json();
    const note = (body.note || "").toString().trim();
    if (!note) {
      return NextResponse.json({ error: "Note is required." }, { status: 400 });
    }
    const entry = await updateLog(id, note);
    return NextResponse.json({ entry });
  } catch (error) {
    if (error instanceof LogNotFoundError) {
      return NextResponse.json({ error: "Log entry not found." }, { status: 404 });
    }
    console.error("Update log error:", error);
    return NextResponse.json({ error: "Failed to update log entry." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    await deleteLog(id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof LogNotFoundError) {
      return NextResponse.json({ error: "Log entry not found." }, { status: 404 });
    }
    console.error("Delete log error:", error);
    return NextResponse.json({ error: "Failed to delete log entry." }, { status: 500 });
  }
}
