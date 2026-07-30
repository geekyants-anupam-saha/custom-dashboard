import { NextResponse } from "next/server";
import { generateOtp, isValidEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const envDomains = process.env.NEXT_PUBLIC_ALLOWED_DOMAINS || "";
    const ALLOWED_EMAIL_DOMAINS = envDomains
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    const allowedDomainsText = ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(
      " or ",
    );

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: `Please enter a valid email ending with ${allowedDomainsText}`,
        },
        { status: 400 },
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    const result = await sendOtpEmail(email, otp);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Unable to send OTP" }, { status: 500 });
  }
}
