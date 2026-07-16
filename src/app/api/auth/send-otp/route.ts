import { NextResponse } from "next/server";
import { generateOtp, isValidEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email ending with @geekyants.com." },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      await prisma.user.create({ data: { email } });
    }

    await prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    const res = await sendOtpEmail(email, otp);

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to send OTP" }, { status: 500 });
  }
}
