import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // Agar Admin Panel access ho raha hai
    if (path.startsWith("/admin")) {
      // Check roles
      if (role !== "admin" && role !== "superadmin" && role !== "editor") {
        // PEHLE: return NextResponse.redirect(new URL("/", req.url));
        
        // AB: Denied page par bhejo
        return NextResponse.redirect(new URL("/denied", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // User logged in hona chahiye
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};