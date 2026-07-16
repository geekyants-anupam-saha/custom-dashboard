import { NextResponse } from "next/server";

const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;
const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const PAGE_NAME = process.env.PAGE_NAME;

export async function GET() {
  if (!APP_ID || !APP_SECRET || !REDIRECT_URI || !PAGE_NAME) {
    return NextResponse.json(
      { error: "Missing Facebook OAuth environment variables." },
      { status: 500 }
    );
  }

  const scope = [
    "pages_show_list",
    "pages_read_engagement",
    "instagram_basic",
    "instagram_manage_insights",
    "business_management",
  ].join(",");

  const authUrl =
    "https://www.facebook.com/v25.0/dialog/oauth" +
    `?client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${scope}` +
    "&response_type=code";

  return NextResponse.redirect(authUrl);
}
