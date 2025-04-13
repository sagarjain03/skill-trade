"use client"

import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const [token, setToken] = useState("")
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showParticles, setShowParticles] = useState(false)

  const verifyUserEmail = async () => {
    try {
      setLoading(true)
      await axios.post("/api/users/verifyemail", { token })
      setVerified(true)
      setError(false)
    } catch (error: any) {
      setError(true)
      console.log(error.response?.data || error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Delay the particles animation for a smoother load
    const timer = setTimeout(() => {
      setShowParticles(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1]
    setToken(urlToken || "")
  }, [])

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail()
    } else {
      setLoading(false)
    }
  }, [token])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/10 animate-pulse"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-purple-600 rounded-2xl rotate-45 transform origin-center"></div>
            <div className="absolute inset-2 bg-blue-500 rounded-xl rotate-12 transform origin-center"></div>
            <div className="absolute inset-4 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SQ</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Email Verification
        </h1>
        <p className="text-gray-400 text-center mb-8">Confirming your email address for SkillQuest</p>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">
              {loading ? "Verifying..." : verified ? "Email Verified!" : "Verification Failed"}
            </CardTitle>
            <CardDescription className="text-center">
              {loading
                ? "Please wait while we verify your email address"
                : verified
                  ? "Your email has been successfully verified"
                  : "We couldn't verify your email address"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75"></div>
                  <div className="relative flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full">
                    <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">This will only take a moment...</p>
              </div>
            ) : verified ? (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-gray-300 text-center mb-4">
                  Thank you for verifying your email address. You can now access all features of SkillQuest.
                </p>
                {token && (
                  <div className="bg-gray-800 rounded-lg p-3 w-full mb-4">
                    <p className="text-xs text-gray-400 text-center">Verification complete</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-gray-300 text-center mb-4">
                  {token
                    ? "The verification link is invalid or has expired. Please request a new verification email."
                    : "No verification token found. Please use the link from your verification email."}
                </p>
                <div className="bg-gray-800 rounded-lg p-3 w-full mb-4">
                  <p className="text-xs text-gray-400 text-center">
                    If you continue to experience issues, please contact support.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!loading && (
              <Link href={verified ? "/login" : "/resend-verification"} className="w-full">
                <Button
                  className={`w-full ${
                    verified
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  }`}
                >
                  {verified ? (
                    <>
                      Continue to Login <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Request New Link <Mail className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Return to{" "}
            <Link href="/" className="text-purple-400 hover:text-purple-300 font-medium">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
