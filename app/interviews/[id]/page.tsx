"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Code,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Mic,
  MicOff,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  BarChart,
  Award,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Types for interview data
interface Interview {
  id: string
  userId: string
  role: string
  type: string
  techstack: string[]
  level: string
  questions: string[]
  finalized: boolean
  createdAt: string
}

export default function InterviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswering, setIsAnswering] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackScore, setFeedbackScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  // Dummy interview data
  const dummyInterviews: Interview[] = [
    {
      id: "1",
      userId: "user1",
      role: "Frontend Developer",
      type: "Technical",
      techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      level: "Junior",
      questions: ["What is React?", "Explain useState hook", "How does React rendering work?"],
      finalized: false,
      createdAt: "2024-03-15T10:00:00Z",
    },
    {
      id: "2",
      userId: "user1",
      role: "Backend Developer",
      type: "Technical",
      techstack: ["Node.js", "Express", "MongoDB", "GraphQL"],
      level: "Mid-level",
      questions: ["What is Node.js?", "Explain RESTful APIs", "How does MongoDB work?"],
      finalized: true,
      createdAt: "2024-03-10T14:30:00Z",
    },
    {
      id: "3",
      userId: "user1",
      role: "Full Stack Developer",
      type: "Behavioral",
      techstack: ["React", "Node.js", "PostgreSQL", "Docker"],
      level: "Senior",
      questions: [
        "Tell me about a challenging project you worked on",
        "How do you handle conflicts in a team?",
        "Describe your ideal work environment",
      ],
      finalized: true,
      createdAt: "2024-02-28T09:15:00Z",
    },
    {
      id: "4",
      userId: "user1",
      role: "UI/UX Designer",
      type: "Portfolio",
      techstack: ["Figma", "Adobe XD", "Sketch", "User Research"],
      level: "Mid-level",
      questions: ["Walk me through your design process", "How do you incorporate user feedback?"],
      finalized: false,
      createdAt: "2024-03-05T11:45:00Z",
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  useEffect(() => {
    // Simulate API call to fetch interview data
    setLoading(true)
    setTimeout(() => {
      const foundInterview = dummyInterviews.find((i) => i.id === params.id)
      if (foundInterview) {
        setInterview(foundInterview)
        setCompleted(foundInterview.finalized)
      }
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleNextQuestion = () => {
    if (!interview) return

    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer("")
      setShowFeedback(false)
    } else {
      // Last question completed
      setCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setUserAnswer("")
      setShowFeedback(false)
    }
  }

  const handleSubmitAnswer = () => {
    setIsAnswering(true)

    // Simulate AI processing
    setTimeout(() => {
      setIsAnswering(false)
      setShowFeedback(true)
      // Generate random score between 60 and 95
      setFeedbackScore(Math.floor(Math.random() * 36) + 60)
    }, 2000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const handleFinishInterview = () => {
    router.push("/interviews")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading interview...</p>
        </div>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-800 p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Interview Not Found</h3>
            <p className="text-gray-400 mb-4">The interview you're looking for doesn't exist or has been removed.</p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => router.push("/interviews")}
            >
              Back to Interviews
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {completed ? (
          // Interview Results View
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Award className="mr-2 h-6 w-6 text-purple-400" />
              Interview Results
            </h1>
            <p className="text-gray-400 mb-8">Review your performance and feedback</p>

            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      className={cn(
                        interview.type === "Technical"
                          ? "bg-blue-500/20 text-blue-400"
                          : interview.type === "Behavioral"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-amber-500/20 text-amber-400",
                      )}
                    >
                      {interview.type}
                    </Badge>
                    <CardTitle className="text-xl mt-2">{interview.role}</CardTitle>
                    <CardDescription>
                      {interview.level} Level • {formatDate(interview.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold">82%</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">Overall Score</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BarChart className="mr-2 h-5 w-5 text-purple-400" /> Performance Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">Technical Knowledge</h4>
                        <Progress value={85} className="h-2 mb-2" />
                        <p className="text-xs text-gray-400">Strong understanding of core concepts</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">Communication</h4>
                        <Progress value={78} className="h-2 mb-2" />
                        <p className="text-xs text-gray-400">Clear explanations with some room for improvement</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">Problem Solving</h4>
                        <Progress value={80} className="h-2 mb-2" />
                        <p className="text-xs text-gray-400">Good approach to breaking down problems</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Question Breakdown</h3>
                    <div className="space-y-4">
                      {interview.questions.map((question, index) => (
                        <Card key={index} className="bg-gray-800 border-gray-700">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">Question {index + 1}</CardTitle>
                              <Badge
                                className={
                                  index % 2 === 0 ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                                }
                              >
                                {index % 2 === 0 ? "Strong" : "Needs Work"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm mb-2">{question}</p>
                            <div className="bg-gray-900 rounded-lg p-3 mb-3">
                              <p className="text-xs text-gray-400 mb-1">Your Answer:</p>
                              <p className="text-sm">
                                {index === 0
                                  ? "React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM to efficiently update the UI."
                                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                              </p>
                            </div>
                            <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                              <p className="text-xs text-purple-400 mb-1">Feedback:</p>
                              <p className="text-sm text-gray-300">
                                {index % 2 === 0
                                  ? "Great explanation! You covered the key concepts clearly. Consider also mentioning React's declarative nature and how it differs from imperative programming."
                                  : "Your answer was on the right track, but could be more specific. Try to provide concrete examples and focus more on the core concepts."}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Areas for Improvement</h3>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Provide more concrete examples in your explanations</li>
                      <li>• Deepen your knowledge of advanced React patterns</li>
                      <li>• Practice explaining technical concepts more concisely</li>
                    </ul>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleFinishInterview}
                  >
                    Back to Interviews
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          // Active Interview View
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Brain className="mr-2 h-6 w-6 text-purple-400" />
                  {interview.role} Interview
                </h1>
                <p className="text-gray-400">
                  {interview.type} • {interview.level} Level
                </p>
              </div>
              <div className="flex items-center">
                <Badge className="bg-purple-500/20 text-purple-400 mr-2">
                  Question {currentQuestionIndex + 1}/{interview.questions.length}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700"
                  onClick={() => router.push("/interviews")}
                >
                  Exit
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                  <CardDescription>Answer as you would in a real interview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-lg">{interview.questions[currentQuestionIndex]}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="answer" className="text-sm font-medium">
                        Your Answer
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn("border-gray-700", isRecording && "bg-red-500/20 text-red-400 border-red-500/50")}
                        onClick={toggleRecording}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-1" /> Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-1" /> Record Answer
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="answer"
                      placeholder="Type your answer here..."
                      className="bg-gray-800 border-gray-700 focus:border-purple-500 min-h-32"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={isAnswering}
                    />
                  </div>

                  {showFeedback && (
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-purple-400">AI Feedback</h3>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-green-400 cursor-pointer" />
                          <ThumbsDown className="h-4 w-4 text-gray-500 hover:text-red-400 cursor-pointer" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Score</span>
                            <span>{feedbackScore}%</span>
                          </div>
                          <Progress
                            value={feedbackScore}
                            className="h-2"
                            indicatorClassName={
                              feedbackScore >= 80 ? "bg-green-500" : feedbackScore >= 60 ? "bg-amber-500" : "bg-red-500"
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          {feedbackScore >= 80
                            ? "Excellent answer! You demonstrated a strong understanding of the concept and provided clear explanations."
                            : feedbackScore >= 60
                              ? "Good answer with some room for improvement. Consider adding more specific examples and technical details."
                              : "Your answer needs more work. Focus on the core concepts and try to be more specific in your explanation."}
                        </p>
                        <div className="mt-3 text-sm">
                          <p className="font-medium text-purple-400 mb-1">Suggestions:</p>
                          <ul className="text-gray-300 space-y-1">
                            <li>• Mention how React's virtual DOM improves performance</li>
                            <li>• Explain the component lifecycle in more detail</li>
                            <li>• Compare React to other frameworks like Angular or Vue</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-700"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0 || isAnswering}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  {showFeedback ? (
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={handleNextQuestion}
                      disabled={isAnswering}
                    >
                      {currentQuestionIndex < interview.questions.length - 1 ? (
                        <>
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Complete Interview <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim() || isAnswering}
                    >
                      {isAnswering ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Analyzing...
                        </div>
                      ) : (
                        <>
                          Submit Answer <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              <div>
                <Card className="bg-gray-900 border-gray-800 sticky top-24">
                  <CardHeader>
                    <CardTitle>Interview Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {currentQuestionIndex + 1}/{interview.questions.length}
                        </span>
                      </div>
                      <Progress
                        value={((currentQuestionIndex + 1) / interview.questions.length) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Code className="h-4 w-4 mr-2 text-purple-400" /> Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {interview.techstack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-700 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2 text-purple-400" /> Tips
                      </h3>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Be specific and provide examples</li>
                        <li>• Structure your answers clearly</li>
                        <li>• It's okay to take a moment to think</li>
                        <li>• Focus on demonstrating your knowledge</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-400" /> Time Management
                      </h3>
                      <p className="text-xs text-gray-400">
                        Aim to spend 3-5 minutes per question. Balance thoroughness with conciseness.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
