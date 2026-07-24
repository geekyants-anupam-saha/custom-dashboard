export function otpTemplate(otp: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>World of Us Dashboard Login</title>
    </head>

    <body
      style="
        margin: 0;
        padding: 24px;
        background-color: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
      "
    >
      <table
        align="center"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="max-width: 560px;"
      >
        <tr>
          <td>
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
              "
            >
              <!-- Header -->
              <tr>
                <td
                  style="
                    background: #111827;
                    padding: 24px;
                    text-align: center;
                  "
                >
                  <h2
                    style="
                      margin: 0;
                      color: #ffffff;
                      font-size: 24px;
                      font-weight: 600;
                    "
                  >
                    World of Us
                  </h2>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  <h3
                    style="
                      margin: 0 0 16px;
                      color: #111827;
                      font-size: 22px;
                      font-weight: 600;
                    "
                  >
                    Verify your dashboard login
                  </h3>

                  <p
                    style="
                      margin: 0 0 16px;
                      color: #4b5563;
                      line-height: 1.6;
                      font-size: 15px;
                    "
                  >
                    We received a request to sign in to the
                    <strong>World of Us Dashboard</strong> using this email
                    address.
                  </p>

                  <p
                    style="
                      margin: 0 0 24px;
                      color: #4b5563;
                      line-height: 1.6;
                      font-size: 15px;
                    "
                  >
                    Enter the verification code below to securely continue:
                  </p>

                  <!-- OTP -->
                  <div
                    style="
                      background: #f3f4f6;
                      border: 1px dashed #d1d5db;
                      border-radius: 10px;
                      text-align: center;
                      padding: 20px;
                      margin: 24px 0;
                    "
                  >
                    <span
                      style="
                        font-size: 36px;
                        font-weight: 700;
                        letter-spacing: 8px;
                        color: #111827;
                      "
                    >
                      ${otp}
                    </span>
                  </div>

                  <p
                    style="
                      margin: 0 0 16px;
                      color: #6b7280;
                      line-height: 1.6;
                      font-size: 14px;
                      text-align: center;
                    "
                  >
                    This code will expire in
                    <strong style="color: #374151;">10 minutes</strong>
                    and can only be used once.
                  </p>

                  <p
                    style="
                      margin: 24px 0 0;
                      color: #6b7280;
                      line-height: 1.6;
                      font-size: 14px;
                    "
                  >
                    If you didn't request this code, you can safely ignore
                    this email. Your account remains secure.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  style="
                    text-align: center;
                    padding: 20px;
                    background: #f9fafb;
                    color: #9ca3af;
                    font-size: 13px;
                    line-height: 1.5;
                  "
                >
                  © ${new Date().getFullYear()} World of Us. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}