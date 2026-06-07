import { NextRequest, NextResponse } from "next/server"

/**
 * Simplified middleware - no country code routing needed since we only support Bangladesh
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  // Set cache ID cookie if not present
  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
