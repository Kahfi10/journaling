// src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isApiAdminRoute = req.nextUrl.pathname.startsWith("/api/entries") &&
    ["POST", "PUT", "DELETE"].includes(req.method)

  if (isAdminRoute && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
