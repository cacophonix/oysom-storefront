import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "bd"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    console.warn("MEDUSA_BACKEND_URL not set, using default region")
    return new Map([["bd", { id: "default", name: "Bangladesh" } as any]])
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      // Fetch regions from Medusa with timeout and error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.status}`)
      }

      const { regions } = await response.json()

      if (!regions?.length) {
        console.warn("No regions found, using default region")
        regionMapCache.regionMap.set("bd", { id: "default", name: "Bangladesh" } as any)
        return regionMapCache.regionMap
      }

      // Create a map of country codes to regions.
      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.warn("Failed to fetch regions, using default:", error)
      // Fallback to default region if API call fails
      regionMapCache.regionMap.set("bd", { id: "default", name: "Bangladesh" } as any)
    }
  }

  return regionMapCache.regionMap
}

/**
 * Always returns Bangladesh country code since we only support Bangladesh.
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  // Always return Bangladesh since we only support Bangladesh
  return "bd"
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  let redirectUrl = request.nextUrl.href
  let response = NextResponse.redirect(redirectUrl, 307)
  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  try {
    const regionMap = await getRegionMap(cacheId)
    const countryCode = regionMap && (await getCountryCode(request, regionMap))

    const urlHasCountryCode =
      countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

    // if one of the country codes is in the url and the cache id is set, return next
    if (urlHasCountryCode && cacheIdCookie) {
      return NextResponse.next()
    }

    // if one of the country codes is in the url and the cache id is not set, set the cache id and redirect
    if (urlHasCountryCode && !cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })

      return response
    }

    // check if the url is a static asset
    if (request.nextUrl.pathname.includes(".")) {
      return NextResponse.next()
    }

    const redirectPath =
      request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

    const queryString = request.nextUrl.search ? request.nextUrl.search : ""

    // If no country code is set, we redirect to the relevant region.
    if (!urlHasCountryCode && countryCode) {
      redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
      response = NextResponse.redirect(`${redirectUrl}`, 307)
    } else if (!urlHasCountryCode && !countryCode) {
      // Fallback to default region if no regions are available
      redirectUrl = `${request.nextUrl.origin}/bd${redirectPath}${queryString}`
      response = NextResponse.redirect(`${redirectUrl}`, 307)
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // If middleware fails, just redirect to default region
    if (!request.nextUrl.pathname.startsWith("/bd")) {
      const redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
      const queryString = request.nextUrl.search ? request.nextUrl.search : ""
      redirectUrl = `${request.nextUrl.origin}/bd${redirectPath}${queryString}`
      return NextResponse.redirect(`${redirectUrl}`, 307)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
