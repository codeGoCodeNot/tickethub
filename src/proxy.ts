import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { loginRateLimit } from "./lib/rate-limit";
import { redis } from "./lib/redis";
import { organizationPath, signInPath, verifyEmailPath } from "./path";

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

  if (
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/organization")
  ) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session)
      return NextResponse.redirect(new URL(signInPath(), request.url));
    if (!session.user.emailVerified)
      return NextResponse.redirect(new URL(verifyEmailPath(), request.url));

    if (!pathname.startsWith("/organization")) {
      const cacheKey = `has-org:${session.user.id}`;
      const cached = await redis.get(cacheKey);

      if (cached === false) {
        return NextResponse.redirect(new URL(organizationPath(), request.url));
      }

      if (cached === null) {
        const organizations = await auth.api.listOrganizations({
          headers: request.headers,
        });
        const hasOrg = organizations.length > 0;
        await redis.set(cacheKey, hasOrg, { ex: 300 }); // Cache for 5 minutes
        if (!hasOrg) {
          return NextResponse.redirect(
            new URL(organizationPath(), request.url),
          );
        }
      }
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/api/auth/sign-in/email",
    "/tickets/:path*",
    "/account/:path*",
    "/organization/:path*",
  ],
};
