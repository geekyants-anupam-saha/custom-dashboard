import { NextResponse } from "next/server";
import axios from "axios";
import { readInstagramConfig } from "@/lib/instagram";

export async function GET(request: Request) {
  const config = await readInstagramConfig();

  if (!config?.instagram_business_id || !config?.page_access_token) {
    return NextResponse.json({ error: "Instagram account is not connected." }, { status: 400 });
  }

  const authHeader = request.headers.get("authorization") || "";
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.replace(/^Bearer\s+/i, "")
    : config.page_access_token;

  try {
    const response = await axios.get(`https://graph.facebook.com/v25.0/${config.instagram_business_id}`, {
      params: {
        fields: "followers_count,media_count",
        access_token: accessToken,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch Instagram followers count." },
      { status: 500 }
    );
  }
}
