import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

const PUBLIC_ROUTES = ["/", "/verify-otp"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const user = token ? await verifyJwt(token) : null;

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
