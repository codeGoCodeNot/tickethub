import { NextRequest, NextResponse } from "next/server";
import { loginRateLimit } from "./lib/rate-limit";

export const proxy = async (request: NextRequest) => {
  if (request.nextUrl.pathname === "/api/auth/sign-in/email") {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await loginRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/api/auth/sign-in/email"],
};
