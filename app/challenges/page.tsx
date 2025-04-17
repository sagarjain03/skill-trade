"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Zap, Trophy, ArrowRight, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Import Redux actions and selectors
import {
  startChallenge,
  answerQuestion,
  resetChallenge,
  selectChallenges,
  selectCurrentChallenge,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectIsCompleted,
  selectCorrectAnswers,
  selectPerformanceBreakdown
} from "@/lib/redux/features/ChallengeData/challengeSlice"

import {
  startTimerAsync,
  stopTimerAsync,
  resetTimer,
  setDuration,
  selectTimeRemainingFormatted,
  selectPercentTimeRemaining,
  selectTimeRemaining
} from "@/lib/redux/features/timer/timerSlice"

import { AppDispatch } from "@/lib/redux/store"

export default function ChallengesPage() {
  const dispatch = useDispatch<AppDispatch>()

  // Challenge selectors
  const challenges = useSelector(selectChallenges)
  const currentChallenge = useSelector(selectCurrentChallenge)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const currentQuestionIndex = useSelector(selectCurrentQuestionIndex)
  const isCompleted = useSelector(selectIsCompleted)
  const correctAnswers = useSelector(selectCorrectAnswers)
  const performanceBreakdown = useSelector(selectPerformanceBreakdown)

  // Timer selectors
  const timeRemainingFormatted = useSelector(selectTimeRemainingFormatted)
  const percentTimeRemaining = useSelector(selectPercentTimeRemaining)
  const timeRemaining = useSelector(selectTimeRemaining)

  // Local UI state
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Auto-complete challenge when time runs out
  useEffect(() => {
    if (currentChallenge && timeRemaining === 0 && !isCompleted) {
      dispatch(stopTimerAsync())
      setShowResults(true)
    }
  }, [timeRemaining, currentChallenge, isCompleted, dispatch])

  // Show results when challenge is completed
  useEffect(() => {
    if (isCompleted) {
      dispatch(stopTimerAsync())
      setShowResults(true)
    }
  }, [isCompleted, dispatch])

  // Handle starting a challenge
  const handleStartChallenge = (id: number) => {
    dispatch(resetChallenge())
    dispatch(resetTimer())

    // Find the challenge to get its time limit
    const challenge = challenges.find(c => c.id === id)
    if (challenge) {
      dispatch(setDuration(challenge.timeLimit))
      dispatch(startChallenge(id))
      dispatch(startTimerAsync())
    }

    setSelectedAnswer(null)
    setShowResults(false)
  }

  // Handle answering a question
  const handleAnswerQuestion = (optionIndex: number) => {
    setSelectedAnswer(optionIndex)

    // Use a short delay to show the selection before moving to next question
    setTimeout(() => {
      dispatch(answerQuestion(optionIndex))
      setSelectedAnswer(null)
    }, 500)
  }

  // Handle resetting the challenge
  const handleResetChallenge = () => {
    dispatch(resetChallenge())
    dispatch(resetTimer())
    setShowResults(false)
    setSelectedAnswer(null)
  }

  // Get the icon component based on string name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Zap": return <Zap className="h-5 w-5 text-yellow-400" />
      case "Shield": return <Shield className="h-5 w-5 text-purple-400" />
      case "Brain": return <Brain className="h-5 w-5 text-blue-400" />
      case "CheckCircle": return <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
      case "XCircle": return <XCircle className="h-4 w-4 text-red-400 mr-2" />
      default: return <Brain className="h-5 w-5" />
    }
  }

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
        {!currentChallenge ? (
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
                      <div className="mr-2">{getIconComponent(challenge.icon)}</div>
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
                      <div className="text-lg font-bold">{challenge.questions.length}</div>
                      <div className="text-xs text-gray-500">Questions</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold">{challenge.timeLimit} min</div>
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
                    onClick={() => handleStartChallenge(challenge.id)}
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
              <div className={cn("h-2 w-full bg-gradient-to-r", currentChallenge.color)}></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <div className="mr-2">{getIconComponent(currentChallenge.icon)}</div>
                    {currentChallenge.title} Challenge
                  </CardTitle>
                  <Badge
                    className={cn(
                      "text-xs",
                      currentChallenge.difficulty === "Medium" && "bg-yellow-500/20 text-yellow-400",
                      currentChallenge.difficulty === "Hard" && "bg-orange-500/20 text-orange-400",
                      currentChallenge.difficulty === "Expert" && "bg-red-500/20 text-red-400",
                    )}
                  >
                    {currentChallenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        Question {currentQuestionIndex + 1} of {currentChallenge.questions.length}
                      </div>
                      <div className="text-sm text-gray-400">
                        Time remaining: {timeRemainingFormatted}
                      </div>
                    </div>

                    <Progress value={percentTimeRemaining} className="h-2" />

                    {currentQuestion && (
                      <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">
                          {currentQuestion.text}
                        </h3>

                        {currentQuestion.code && (
                          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-6 overflow-x-auto whitespace-pre">
                            {currentQuestion.code}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentQuestion.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className={cn(
                                "justify-start h-auto py-3 px-4 border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600",
                                selectedAnswer === index && "border-blue-500 bg-blue-500/20"
                              )}
                              onClick={() => handleAnswerQuestion(index)}
                            >
                              <div className={cn(
                                "h-5 w-5 rounded-full border border-gray-600 mr-2 flex-shrink-0 flex items-center justify-center",
                                selectedAnswer === index && "border-blue-500 bg-blue-500"
                              )}>
                                {selectedAnswer === index && <div className="h-2 w-2 rounded-full bg-white"></div>}
                              </div>
                              <span>{option}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
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
                        You've completed the {currentChallenge.title} challenge.
                      </p>

                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                        <div className="bg-gray-900 rounded-lg p-3">
                          <div className="text-lg font-bold">
                            {correctAnswers}/{currentChallenge.questions.length}
                          </div>
                          <div className="text-xs text-gray-500">Correct Answers</div>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3">
                          <div className="text-lg font-bold">
                            {Math.round(currentChallenge.xpReward * (correctAnswers / currentChallenge.questions.length))} XP
                          </div>
                          <div className="text-xs text-gray-500">Earned</div>
                        </div>
                      </div>

                      <div className="space-y-3 text-left mb-6">
                        <h4 className="font-medium">Performance Breakdown:</h4>
                        {performanceBreakdown.map((category, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                            <div className="flex items-center">
                              {category.icon === "CheckCircle" ? (
                                <CheckCircle className={cn(
                                  "h-4 w-4 mr-2",
                                  category.status === "Strong" ? "text-green-400" : "text-yellow-400"
                                )} />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400 mr-2" />
                              )}
                              <span>{category.name}</span>
                            </div>
                            <Badge className={cn(
                              category.status === "Strong" && "bg-green-500/20 text-green-400",
                              category.status === "Good" && "bg-yellow-500/20 text-yellow-400",
                              category.status === "Needs Work" && "bg-red-500/20 text-red-400"
                            )}>
                              {category.status}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          View Detailed Results
                        </Button>
                        <Button variant="outline" className="border-gray-700" onClick={handleResetChallenge}>
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