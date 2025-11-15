"use client"

/**
 * Initiates Google OAuth flow by redirecting to the backend auth endpoint
 */
export function initiateGoogleAuth() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  window.location.href = `${backendUrl}/auth/google`
}

/**
 * Check if user just completed OAuth authentication
 * Returns { success: boolean, error?: string }
 */
export function checkAuthStatus(): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false }
  }

  const params = new URLSearchParams(window.location.search)
  const authStatus = params.get("auth")
  const errorMessage = params.get("message")

  if (authStatus === "success") {
    // Clean up URL
    const url = new URL(window.location.href)
    url.searchParams.delete("auth")
    window.history.replaceState({}, "", url.toString())
    return { success: true }
  }

  if (authStatus === "error") {
    // Clean up URL
    const url = new URL(window.location.href)
    url.searchParams.delete("auth")
    url.searchParams.delete("message")
    window.history.replaceState({}, "", url.toString())
    return { success: false, error: errorMessage || "Authentication failed" }
  }

  return { success: false }
}