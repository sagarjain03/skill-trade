"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, Check, X } from "lucide-react"

export default function MatchSection() {
  const [showMatch, setShowMatch] = useState(false)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    // Simulate a match after 3 seconds
    const timer = setTimeout(() => {
      setShowMatch(true)
      setConfetti(true)

      // Hide confetti after animation
      setTimeout(() => {
        setConfetti(false)
      }, 3000)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mb-12 relative">
      {confetti && (
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

      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Sparkles className="mr-2 h-6 w-6 text-blue-400" />
        Skill Matching
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Find Your Perfect Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400">
                Our matching system pairs users with complementary skills. You teach what you know, and learn what you
                want.
              </p>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium mb-2">Skills You Can Teach</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">JavaScript</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">React</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">UI Design</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs border-dashed border-gray-700 bg-transparent"
                  >
                    + Add Skill
                  </Button>
                </div>

                <h3 className="font-medium mb-2">Skills You Want to Learn</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">Python</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">Data Science</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs border-dashed border-gray-700 bg-transparent"
                  >
                    + Add Skill
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Find Matches <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          {showMatch ? (
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-center flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                    It's a Match!
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center mb-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-blue-500">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Your avatar" />
                      <AvatarFallback className="bg-gray-700">YOU</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-blue-500 to-blue-700">
                      B
                    </div>
                  </div>

                  <div className="mx-4 text-center">
                    <div className="bg-gray-800 rounded-full px-3 py-1 text-xs font-medium mb-1">Perfect Match</div>
                    <div className="flex">
                      <ArrowRight className="h-4 w-4 text-blue-400 mx-1" />
                      <ArrowRight className="h-4 w-4 text-purple-400 mx-1 rotate-180" />
                    </div>
                  </div>

                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-purple-500">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Match avatar" />
                      <AvatarFallback className="bg-gray-700">JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-purple-700">
                      A
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-blue-400 mb-2">You'll Teach</h3>
                    <div className="flex flex-wrap gap-1">
                      <Badge className="bg-blue-500/20 text-blue-400">React</Badge>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-purple-400 mb-2">You'll Learn</h3>
                    <div className="flex flex-wrap gap-1">
                      <Badge className="bg-purple-500/20 text-purple-400">Python</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <h3 className="text-sm font-medium mb-2">About DataWizard98</h3>
                  <p className="text-xs text-gray-400">
                    Python developer with 5 years of experience. Passionate about teaching data science and machine
                    learning concepts to beginners.
                  </p>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Start Conversation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-800 h-full flex flex-col justify-center items-center p-8">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full">
                  <Sparkles className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Finding Matches...</h3>
              <p className="text-gray-400 text-center mb-4">
                We're looking for users with complementary skills to yours
              </p>
              <div className="w-full max-w-xs bg-gray-800 rounded-full h-2 mb-4">
                <div className="bg-blue-500 h-2 rounded-full animate-progress"></div>
              </div>
              <p className="text-xs text-gray-500">This usually takes less than a minute</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
