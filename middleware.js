import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Get user session token from cookies
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users away from dashboard
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Prevent authenticated users from accessing /auth page again
  if (session && pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard/home", req.url));
  }

  if (pathname.startsWith("/dashboard/admin")) {
    if (!session || session.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
  }


  return NextResponse.next();
}

// Apply middleware only to dashboard and auth routes
export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
