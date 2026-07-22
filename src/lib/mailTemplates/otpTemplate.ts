export function otpTemplate(otp: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verification</title>
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
                    "
                  >
                    Tales of Us
                  </h2>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px;">
                  <h3
                    style="
                      margin: 0 0 16px;
                      color: #111827;
                      font-size: 22px;
                    "
                  >
                    Verify your email
                  </h3>

                  <p
                    style="
                      margin: 0 0 24px;
                      color: #4b5563;
                      line-height: 1.6;
                    "
                  >
                    Use the verification code below to continue. This OTP is
                    valid for <strong>10 minutes</strong>.
                  </p>

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
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #111827;
                      "
                    >
                      ${otp}
                    </span>
                  </div>

                  <p
                    style="
                      color: #6b7280;
                      line-height: 1.6;
                      margin: 0;
                    "
                  >
                    If you didn't request this code, you can safely ignore this
                    email.
                  </p>
                </td>
              </tr>

              <tr>
                <td
                  style="
                    text-align: center;
                    padding: 20px;
                    background: #f9fafb;
                    color: #9ca3af;
                    font-size: 13px;
                  "
                >
                  © ${new Date().getFullYear()} Tales of Us. All rights reserved.
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
