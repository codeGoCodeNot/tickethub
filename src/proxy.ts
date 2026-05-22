import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { loginRateLimit } from "./lib/rate-limit";
import { signInPath, verifyEmailPath } from "./path";

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/auth/sign-in/email") {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await loginRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }
  }

  if (pathname.startsWith("/tickets") || pathname.startsWith("/account")) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session)
      return NextResponse.redirect(new URL(signInPath(), request.url));
    if (!session.user.emailVerified)
      return NextResponse.redirect(new URL(verifyEmailPath(), request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/api/auth/sign-in/email", "/tickets/:path*", "/account/:path*"],
};
