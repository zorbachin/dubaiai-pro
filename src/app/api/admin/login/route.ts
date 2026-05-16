import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const COOKIE = "dubaiai_admin";

export async function POST(req: NextRequest) {
  if (!env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin disabled — set ADMIN_PASSWORD" }, { status: 503 });
  }
  const fd = await req.formData();
  const password = String(fd.get("password") || "");
  if (password !== env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL("/admin?bad=1", req.url));
  }
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set(COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12 // 12h
  });
  return res;
}
