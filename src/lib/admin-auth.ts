import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE = "rimsom_admin_token";
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || "changeme";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function generateToken(): string {
  const payload = `${Date.now()}_${crypto.randomUUID()}`;
  const hmac = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function validateToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  if (sig !== expected) return false;
  const timestamp = parseInt(payload.split("_")[0], 10);
  if (Number.isNaN(timestamp)) return false;
  return Date.now() - timestamp < TOKEN_TTL_MS;
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return Boolean(token && validateToken(token));
}
