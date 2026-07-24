import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export type AuthUser = {
  id: string;
  email: string;
};

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "local-dev-secret",
);

const ALLOWED_EMAIL_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN!;

export function isValidEmail(email: string) {
  const escapedDomain = ALLOWED_EMAIL_DOMAIN.replace(".", "\\.");

  return new RegExp(`^[A-Za-z0-9._%+-]+@${escapedDomain}$`, "i").test(email);
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createJwt(user: AuthUser) {
  return new SignJWT({ sub: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
    } satisfies AuthUser;
  } catch {
    return null;
  }
}

export async function getCurrentUserFromRequest(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return null;
  }

  return verifyJwt(token);
}

export async function getAuthenticatedUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  return verifyJwt(token);
}
