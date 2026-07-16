import { Resend } from 'resend';

export async function sendOtpEmail(email: string, otp: string) {
  const resend = new Resend(process.env.EMAIL_API_KEY || '');

  const response = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    to: email,
    subject: "Your WoU Dashboard verification code",
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`
  });

  console.log(response);

  return response;
}