"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, BookOpen, Users, Zap, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const rankColors = {
  S: "from-yellow-400 to-amber-600",
  A: "from-purple-500 to-purple-700",
  B: "from-blue-500 to-blue-700",
  C: "from-green-500 to-green-700",
  D: "from-orange-500 to-orange-700",
  Beginner: "from-gray-500 to-gray-700",
}

const rankBorderColors = {
  S: "border-yellow-400",
  A: "border-purple-500",
  B: "border-blue-500",
  C: "border-green-500",
  D: "border-orange-500",
  Beginner: "border-gray-500",
}

export default function UserDashboard() {
  const [progress, setProgress] = useState(65)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const rank = "B"
  const nextRank = "A"
  const xpCurrent = 2450
  const xpRequired = 3000

  // Simulate XP gain
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 75) {
        setProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            setShowLevelUp(true)
            return 100
          }
          return newProgress
        })
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [progress])

  // Hide level up animation after a delay
  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => {
        setShowLevelUp(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showLevelUp])

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Award className="mr-2 h-6 w-6 text-purple-400" />
          Your Quest Progress
        </h2>
        <Link href="/profile">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
            View Full Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="relative">
                <Avatar className={cn("h-16 w-16 border-2", rankBorderColors[rank])}>
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="@username" />
                  <AvatarFallback className="bg-gray-700 text-lg">UN</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold bg-gradient-to-br",
                    rankColors[rank],
                  )}
                >
                  {rank}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-bold">SkillMaster42</h3>
                <p className="text-sm text-gray-400">Joined 3 months ago</p>
                <div className="flex mt-1 space-x-1">
                  <Badge variant="outline" className="bg-gray-800 text-xs">
                    JavaScript
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800 text-xs">
                    Design
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rank Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {showLevelUp && (
                <div className="absolute inset-0 flex items-center justify-center z-10 animate-fadeOut">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                    <ChevronUp className="h-8 w-8 text-purple-400 animate-bounce" />
                    <p className="font-bold text-purple-400">XP Gained!</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 bg-gradient-to-br",
                      rankColors[rank],
                    )}
                  >
                    {rank}
                  </div>
                  <span className="text-sm">Current Rank</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">Next Rank</span>
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ml-2 bg-gradient-to-br opacity-70",
                      rankColors[nextRank],
                    )}
                  >
                    {nextRank}
                  </div>
                </div>
              </div>

              <Progress value={progress} className="h-3 mb-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-white">
                    {xpCurrent} / {xpRequired} XP
                  </span>
                </div>
              </Progress>

              <div className="text-xs text-gray-400 text-center">{xpRequired - xpCurrent} XP needed for next rank</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-bold">12</div>
                  <div className="text-xs text-gray-400">Skills Learned</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xl font-bold">8</div>
                  <div className="text-xs text-gray-400">Skills Taught</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Zap className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <div className="text-xl font-bold">24</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                  <Award className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xl font-bold">5</div>
                  <div className="text-xs text-gray-400">Achievements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
