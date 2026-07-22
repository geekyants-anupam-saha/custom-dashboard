import mailchimpTransactional from "@mailchimp/mailchimp_transactional";
import { otpTemplate } from "@/lib/mailTemplates/otpTemplate";

const mailchimp = mailchimpTransactional(
  process.env.MAILCHIMP_TRANSACTIONAL_API_KEY!,
);

export async function sendOtpEmail(email: string, otp: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await mailchimp.messages.send({
      message: {
        from_email: process.env.FROM_EMAIL!,
        from_name: process.env.FROM_NAME || "World of Us",
        to: [
          {
            email,
            type: "to",
          },
        ],
        subject: "Your OTP Code",
        html: otpTemplate(otp),
      },
    } as any);

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Mailchimp Transactional Error:", error);

    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
}
