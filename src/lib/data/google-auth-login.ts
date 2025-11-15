"use server"

import { sdk } from "@lib/config"
import { setAuthToken, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"

/**
 * Complete Google OAuth login by authenticating with the backend
 * This should be called after the OAuth callback redirects back to the frontend
 */
export async function completeGoogleLogin(email: string, googleId: string) {
  try {
    // Generate the deterministic password (same as backend uses)
    const googlePassword = `google_oauth_${googleId}_${process.env.JWT_SECRET || "supersecret"}`
    
    // Log in using the emailpass provider
    const token = await sdk.auth.login("customer", "emailpass", {
      email,
      password: googlePassword,
    })

    if (token) {
      await setAuthToken(token as string)
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true }
    }
    
    return { success: false, error: "No token received" }
  } catch (error: any) {
    console.error("Google login completion error:", error)
    return { success: false, error: error.message || "Failed to complete login" }
  }
}