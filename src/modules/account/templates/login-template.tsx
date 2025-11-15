"use client"

import { useState, useEffect } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { checkAuthStatus } from "@lib/data/google-auth"
import { completeGoogleLogin } from "@lib/data/google-auth-login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isProcessingLogin, setIsProcessingLogin] = useState(false)

  useEffect(() => {
    // Check if user just completed OAuth authentication
    const processOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const authStatus = params.get("auth")
      
      if (authStatus === "google_success") {
        // Backend has already set the auth cookie, just reload to show authenticated state
        setAuthMessage({ type: "success", message: "Successfully signed in with Google!" })
        // Clean URL and reload
        setTimeout(() => {
          window.location.href = "/account"
        }, 500)
      } else if (authStatus === "error") {
        const errorMessage = params.get("message")
        setAuthMessage({ type: "error", message: errorMessage ? decodeURIComponent(errorMessage) : "Authentication failed" })
        setTimeout(() => setAuthMessage(null), 5000)
      }
    }
    
    processOAuthCallback()
  }, [])

  return (
    <div className="w-full flex justify-start px-8 py-8">
      <div className="w-full max-w-sm">
        {authMessage && (
          <div
            className={`mb-6 p-4 rounded-md ${
              authMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {authMessage.message}
          </div>
        )}
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
