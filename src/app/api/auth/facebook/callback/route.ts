import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const PAGE_NAME = process.env.PAGE_NAME;

export async function GET(request: Request) {
  if (!APP_ID || !APP_SECRET || !REDIRECT_URI || !PAGE_NAME) {
    return NextResponse.json(
      { error: "Missing Facebook OAuth environment variables." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  try {
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v25.0/oauth/access_token",
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );

    const shortLivedToken = tokenResponse.data.access_token;

    const longLivedResponse = await axios.get(
      "https://graph.facebook.com/v25.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: APP_ID,
          client_secret: APP_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    const longLivedToken = longLivedResponse.data.access_token;

    const pages = await axios.get("https://graph.facebook.com/v25.0/me/accounts", {
      params: {
        access_token: longLivedToken,
      },
    });

    const allPages = pages?.data?.data || [];

    if (allPages.length === 0) {
      return NextResponse.json({ error: "No Facebook pages were found." }, { status: 404 });
    }

    const savedPages = [] as Array<{
      id: string;
      name: string;
      pageAccessToken: string;
      instagramBusinessAccountId: string | null;
    }>;

    for (const page of allPages) {
      const igResponse = await axios.get(`https://graph.facebook.com/v25.0/${page.id}`, {
        params: {
          fields: "instagram_business_account",
          access_token: page.access_token,
        },
      });

      const instagramId = igResponse?.data?.instagram_business_account?.id || null;

      savedPages.push({
        id: page.id,
        name: page.name,
        pageAccessToken: page.access_token,
        instagramBusinessAccountId: instagramId,
      });
    }

    for (const savedPage of savedPages) {
      const existingAccount = await prisma.facebookAccount.findUnique({
        where: { pageId: savedPage.id },
      });

      if (existingAccount) {
        await prisma.facebookAccount.update({
          where: { id: existingAccount.id },
          data: {
            name: savedPage.name,
            pageAccessToken: savedPage.pageAccessToken,
            instagramBusinessAccountId: savedPage.instagramBusinessAccountId || "",
          },
        });
      } else {
        await prisma.facebookAccount.create({
          data: {
            pageId: savedPage.id,
            name: savedPage.name,
            pageAccessToken: savedPage.pageAccessToken,
            instagramBusinessAccountId: savedPage.instagramBusinessAccountId || "",
          },
        });
      }
    }

    const html = `<!DOCTYPE html>
    <html>
      <body>
        <script>
          window.opener?.postMessage(
            {
              success: true,
              type: "INSTAGRAM_CONNECTED",
            },
            "*"
          );

          window.close();
        </script>
      </body>
    </html>`;

    return new NextResponse(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Instagram connection failed." },
      { status: 500 }
    );
  }
}
