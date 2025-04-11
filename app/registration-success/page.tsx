"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function RegistrationSuccessPage() {
  const [progress, setProgress] = useState(0)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    // Simulate progress
    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setShowBadge(true)
      }, 500)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
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

      {/* Confetti animation when badge appears */}
      {showBadge && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-6 animate-confetti"
              style={{
                top: "-20px",
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#ff0", "#f0f", "#0ff", "#f00", "#0f0", "#00f"][Math.floor(Math.random() * 6)],
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md z-10">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Registration Complete!</CardTitle>
            <CardDescription>Your SkillQuest journey begins now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Setting up your account...</span>
                <span className="text-sm text-green-400">{progress === 100 ? "Complete!" : "In progress..."}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {showBadge && (
              <div className="bg-gray-800 rounded-lg p-4 text-center animate-fadeIn">
                <h3 className="text-lg font-bold mb-2">Achievement Unlocked!</h3>
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 mb-2">+50 XP</Badge>
                <p className="text-sm text-gray-400">You've earned the "First Steps" badge for joining SkillQuest!</p>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">What's next?</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                  <span>Create your account</span>
                </li>
                <li className="flex items-start">
                  <div className="h-4 w-4 border border-gray-600 rounded-full mr-2 mt-0.5"></div>
                  <span>Complete your profile and add skills</span>
                </li>
                <li className="flex items-start">
                  <div className="h-4 w-4 border border-gray-600 rounded-full mr-2 mt-0.5"></div>
                  <span>Find your first skill match</span>
                </li>
                <li className="flex items-start">
                  <div className="h-4 w-4 border border-gray-600 rounded-full mr-2 mt-0.5"></div>
                  <span>Complete your first learning session</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
