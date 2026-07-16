import { NextResponse } from "next/server";
import { readInstagramConfig } from "@/lib/instagram";

export async function GET() {
  const config = await readInstagramConfig();

  const connected = Boolean(config?.instagram_business_id && config?.page_access_token);

  return NextResponse.json({ connected });
}
