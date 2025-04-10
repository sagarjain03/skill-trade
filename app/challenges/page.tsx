"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Zap, Trophy, ArrowRight, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function ChallengesPage() {
  const [currentChallenge, setCurrentChallenge] = useState<number | null>(null)
  const [challengeProgress, setChallengeProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const startChallenge = (id: number) => {
    setCurrentChallenge(id)
    setChallengeProgress(0)
    setShowResults(false)

    // Simulate challenge progress
    const interval = setInterval(() => {
      setChallengeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setShowResults(true), 500)
          return 100
        }
        return prev + 20
      })
    }, 1000)
  }

  const resetChallenge = () => {
    setCurrentChallenge(null)
    setChallengeProgress(0)
    setShowResults(false)
  }

  const challenges = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics, closures, and ES6 features.",
      difficulty: "Medium",
      xpReward: 150,
      icon: <Zap className="h-5 w-5 text-yellow-400" />,
      color: "from-yellow-600 to-amber-600",
      questions: 10,
      timeLimit: "15 min",
    },
    {
      id: 2,
      title: "UI/UX Design Principles",
      description: "Demonstrate your understanding of design systems, accessibility, and user flows.",
      difficulty: "Hard",
      xpReward: 200,
      icon: <Shield className="h-5 w-5 text-purple-400" />,
      color: "from-purple-600 to-pink-600",
      questions: 12,
      timeLimit: "20 min",
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      description: "Solve coding challenges focused on efficient problem-solving techniques.",
      difficulty: "Expert",
      xpReward: 300,
      icon: <Brain className="h-5 w-5 text-blue-400" />,
      color: "from-blue-600 to-cyan-600",
      questions: 8,
      timeLimit: "30 min",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Brain className="mr-2 h-6 w-6 text-blue-400" />
        AI Skill Challenges
      </h1>

      <div className="mb-6">
        <p className="text-gray-400 max-w-3xl">
          Test your skills with our AI-powered challenges. Complete challenges to earn XP, unlock achievements, and get
          personalized feedback on your strengths and weaknesses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {currentChallenge === null ? (
          // Challenge selection view
          <>
            {challenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="bg-gray-900 border-gray-800 overflow-hidden group hover:border-gray-700 transition-all"
              >
                <div className={cn("h-2 w-full bg-gradient-to-r", challenge.color)}></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center">
                      <div className="mr-2">{challenge.icon}</div>
                      {challenge.title}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "text-xs",
                        challenge.difficulty === "Medium" && "bg-yellow-500/20 text-yellow-400",
                        challenge.difficulty === "Hard" && "bg-orange-500/20 text-orange-400",
                        challenge.difficulty === "Expert" && "bg-red-500/20 text-red-400",
                      )}
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold">{challenge.questions}</div>
                      <div className="text-xs text-gray-500">Questions</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold">{challenge.timeLimit}</div>
                      <div className="text-xs text-gray-500">Time Limit</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-sm">Reward</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">+{challenge.xpReward} XP</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className={cn("w-full bg-gradient-to-r", challenge.color, "hover:opacity-90")}
                    onClick={() => startChallenge(challenge.id)}
                  >
                    Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </>
        ) : (
          // Active challenge view
          <div className="lg:col-span-3">
            <Card className="bg-gray-900 border-gray-800">
              <div
                className={cn("h-2 w-full bg-gradient-to-r", challenges.find((c) => c.id === currentChallenge)?.color)}
              ></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <div className="mr-2">{challenges.find((c) => c.id === currentChallenge)?.icon}</div>
                    {challenges.find((c) => c.id === currentChallenge)?.title} Challenge
                  </CardTitle>
                  <Badge
                    className={cn(
                      "text-xs",
                      challenges.find((c) => c.id === currentChallenge)?.difficulty === "Medium" &&
                        "bg-yellow-500/20 text-yellow-400",
                      challenges.find((c) => c.id === currentChallenge)?.difficulty === "Hard" &&
                        "bg-orange-500/20 text-orange-400",
                      challenges.find((c) => c.id === currentChallenge)?.difficulty === "Expert" &&
                        "bg-red-500/20 text-red-400",
                    )}
                  >
                    {challenges.find((c) => c.id === currentChallenge)?.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Question {Math.ceil(challengeProgress / 10)} of{" "}
                        {challenges.find((c) => c.id === currentChallenge)?.questions}
                      </div>
                      <div className="text-sm text-gray-400">
                        Time remaining:{" "}
                        {Math.floor(
                          (Number.parseInt(challenges.find((c) => c.id === currentChallenge)?.timeLimit || "0") *
                            (100 - challengeProgress)) /
                            100,
                        )}{" "}
                        min
                      </div>
                    </div>

                    <Progress value={challengeProgress} className="h-2" />

                    <div className="bg-gray-800 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        {currentChallenge === 1 && "What is the output of the following code?"}
                        {currentChallenge === 2 && "Which design principle is being violated in this UI?"}
                        {currentChallenge === 3 && "What is the time complexity of this algorithm?"}
                      </h3>

                      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-6 overflow-x-auto">
                        {currentChallenge === 1 &&
                          `
const x = { a: 1 };
const y = { a: 1 };
console.log(x === y);
                        `}
                        {currentChallenge === 2 &&
                          `
[Image showing a form with poor contrast and no labels]
                        `}
                        {currentChallenge === 3 &&
                          `
function mystery(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      result += arr[i] * arr[j];
    }
  }
  return result;
}
                        `}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          currentChallenge === 1 ? "true" : currentChallenge === 2 ? "Proximity" : "O(n)",
                          currentChallenge === 1 ? "false" : currentChallenge === 2 ? "Contrast" : "O(n²)",
                          currentChallenge === 1 ? "undefined" : currentChallenge === 2 ? "Alignment" : "O(n log n)",
                          currentChallenge === 1 ? "Error" : currentChallenge === 2 ? "Repetition" : "O(2ⁿ)",
                        ].map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start h-auto py-3 px-4 border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600"
                          >
                            <div className="h-5 w-5 rounded-full border border-gray-600 mr-2 flex-shrink-0"></div>
                            <span>{option}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Results view
                  <div className="space-y-6">
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                        <Trophy className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
                      <p className="text-gray-400 mb-4">
                        You've completed the {challenges.find((c) => c.id === currentChallenge)?.title} challenge.
                      </p>

                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                        <div className="bg-gray-900 rounded-lg p-3">
                          <div className="text-lg font-bold">
                            7/{challenges.find((c) => c.id === currentChallenge)?.questions}
                          </div>
                          <div className="text-xs text-gray-500">Correct Answers</div>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3">
                          <div className="text-lg font-bold">
                            {challenges.find((c) => c.id === currentChallenge)?.xpReward} XP
                          </div>
                          <div className="text-xs text-gray-500">Earned</div>
                        </div>
                      </div>

                      <div className="space-y-3 text-left mb-6">
                        <h4 className="font-medium">Performance Breakdown:</h4>
                        <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span>JavaScript Fundamentals</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400">Strong</Badge>
                        </div>
                        <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-yellow-400 mr-2" />
                            <span>ES6 Features</span>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-400">Good</Badge>
                        </div>
                        <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-400 mr-2" />
                            <span>Closures & Scope</span>
                          </div>
                          <Badge className="bg-red-500/20 text-red-400">Needs Work</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          View Detailed Results
                        </Button>
                        <Button variant="outline" className="border-gray-700" onClick={resetChallenge}>
                          Back to Challenges
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
