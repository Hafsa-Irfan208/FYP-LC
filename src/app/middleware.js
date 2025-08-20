import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/StudentDashboard") && token.role !== "Student") {
    // Redirect non-student users trying to access Student Dashboard
    return NextResponse.redirect(new URL("/TeacherDashboard", req.url));
  }

  if (pathname.startsWith("/TeacherDashboard") && token.role !== "Teacher") {
    // Redirect non-teacher users trying to access Teacher Dashboard
    return NextResponse.redirect(new URL("/StudentDashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/StudentDashboard/:path*", "/TeacherDashboard/:path*"],
};
