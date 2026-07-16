import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: { id: dbUser.id, email: dbUser.email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch session" }, { status: 500 });
  }
}
