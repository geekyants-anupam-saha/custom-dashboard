import { NextResponse } from "next/server";
import { createJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const otp = typeof body?.otp === "string" ? body.otp : "";

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const verification = await prisma.otpVerification.findUnique({ where: { email } });
    if (!verification) {
      return NextResponse.json({ error: "OTP not found" }, { status: 404 });
    }

    if (verification.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (verification.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = await createJwt({ id: user.id, email: user.email });

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to verify OTP" }, { status: 500 });
  }
}
