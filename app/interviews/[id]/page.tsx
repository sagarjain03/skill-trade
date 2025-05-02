"use client"

import { useState, useEffect, useRef } from "react"
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
  Volume2,
  VolumeX,
  RefreshCw,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import axios from "@/lib/axios"

// Types for interview data
interface Interview {
  _id: string
  userId: string
  role: string
  type: string
  techstack: string[]
  level: string
  questions: string[]
  answers?: string[]
  feedback?: InterviewFeedback[]
  finalized: boolean
  createdAt: string
}

interface InterviewFeedback {
  questionIndex: number
  score: number
  feedback: string
  suggestions: string[]
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
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSuggestions, setFeedbackSuggestions] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const [overallScore, setOverallScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [vapiCallId, setVapiCallId] = useState<string | null>(null)
  const [transcription, setTranscription] = useState("")
  const [interviewResults, setInterviewResults] = useState<InterviewFeedback[]>([])

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/interviews/${params.id}`)
        if (response.data.success) {
          setInterview(response.data.interview)
          setCompleted(response.data.interview.finalized)

          if (response.data.interview.feedback && response.data.interview.feedback.length > 0) {
            setInterviewResults(response.data.interview.feedback)

            // Calculate overall score
            const totalScore = response.data.interview.feedback.reduce(
              (sum: number, item: InterviewFeedback) => sum + item.score,
              0,
            )
            setOverallScore(Math.round(totalScore / response.data.interview.feedback.length))
          }
        } else {
          toast.error("Failed to load interview")
        }
      } catch (error) {
        console.error("Error fetching interview:", error)
        toast.error("Error loading interview data")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInterview()
    }
  }, [params.id])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleNextQuestion = async () => {
    if (!interview) return

    // Save the current answer and feedback before moving to next question
    try {
      await axios.post(`/interviews/${interview._id}/answer`, {
        questionIndex: currentQuestionIndex,
        answer: userAnswer,
        feedback: {
          score: feedbackScore,
          feedback: feedbackText,
          suggestions: feedbackSuggestions,
        },
      })
    } catch (error) {
      console.error("Error saving answer:", error)
      toast.error("Failed to save your answer")
    }

    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer("")
      setShowFeedback(false)
      setTranscription("")
    } else {
      // Last question completed
      try {
        await axios.patch(`/interviews/${interview._id}/finalize`)
        setCompleted(true)
        toast.success("Interview completed!")

        // Fetch the final results
        const response = await axios.get(`/interviews/${interview._id}`)
        if (response.data.success) {
          setInterviewResults(response.data.interview.feedback || [])

          // Calculate overall score
          if (response.data.interview.feedback && response.data.interview.feedback.length > 0) {
            const totalScore = response.data.interview.feedback.reduce(
              (sum: number, item: InterviewFeedback) => sum + item.score,
              0,
            )
            setOverallScore(Math.round(totalScore / response.data.interview.feedback.length))
          }
        }
      } catch (error) {
        console.error("Error finalizing interview:", error)
        toast.error("Failed to complete interview")
      }
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)

      // Load previous answer if available
      if (interview?.answers && interview.answers[currentQuestionIndex - 1]) {
        setUserAnswer(interview.answers[currentQuestionIndex - 1])
      } else {
        setUserAnswer("")
      }

      // Load previous feedback if available
      if (interview?.feedback && interview.feedback[currentQuestionIndex - 1]) {
        const feedback = interview.feedback[currentQuestionIndex - 1]
        setFeedbackScore(feedback.score)
        setFeedbackText(feedback.feedback)
        setFeedbackSuggestions(feedback.suggestions)
        setShowFeedback(true)
      } else {
        setShowFeedback(false)
      }
    }
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return

    setIsAnswering(true)

    try {
      // Send the answer to the backend for AI analysis
      const response = await axios.post(`/interviews/${interview?._id}/analyze`, {
        questionIndex: currentQuestionIndex,
        answer: userAnswer,
        question: interview?.questions[currentQuestionIndex],
      })

      if (response.data.success) {
        setFeedbackScore(response.data.score)
        setFeedbackText(response.data.feedback)
        setFeedbackSuggestions(response.data.suggestions || [])
        setShowFeedback(true)
      } else {
        toast.error("Failed to analyze answer")
      }
    } catch (error) {
      console.error("Error analyzing answer:", error)
      toast.error("Error analyzing your answer")
    } finally {
      setIsAnswering(false)
    }
  }

  // Start Vapi call for voice interview
  const startVapiCall = async () => {
    if (!interview) return

    try {
      setIsRecording(true)

      // Initialize Vapi call
      const response = await axios.post("/api/vapi/start-interview", {
        question: interview.questions[currentQuestionIndex],
        role: interview.role,
        type: interview.type,
        level: interview.level,
      })

      if (response.data.success) {
        setVapiCallId(response.data.callId)

        // Create audio element for the call
        if (!audioRef.current) {
          const audio = new Audio(response.data.audioUrl)
          audio.onended = () => setIsPlaying(false)
          audioRef.current = audio
        } else {
          audioRef.current.src = response.data.audioUrl
        }

        // Start playing the interviewer's question
        audioRef.current.play()
        setIsPlaying(true)

        // Poll for transcription updates
        pollForTranscription(response.data.callId)
      } else {
        toast.error("Failed to start voice interview")
        setIsRecording(false)
      }
    } catch (error) {
      console.error("Error starting Vapi call:", error)
      toast.error("Failed to initialize voice interview")
      setIsRecording(false)
    }
  }

  // End Vapi call
  const endVapiCall = async () => {
    if (!vapiCallId) return

    try {
      // Stop the audio if playing
      if (audioRef.current && isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      }

      // End the Vapi call
      const response = await axios.post("/api/vapi/end-interview", {
        callId: vapiCallId,
      })

      if (response.data.success) {
        // Set the transcribed answer
        setUserAnswer(transcription)
        toast.success("Voice interview completed")
      } else {
        toast.error("Failed to end voice interview")
      }
    } catch (error) {
      console.error("Error ending Vapi call:", error)
      toast.error("Error ending voice interview")
    } finally {
      setIsRecording(false)
      setVapiCallId(null)
    }
  }

  // Poll for transcription updates
  const pollForTranscription = async (callId: string) => {
    if (!callId) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/vapi/transcription/${callId}`)

        if (response.data.success) {
          setTranscription(response.data.transcription)

          // If call is completed, clear interval
          if (response.data.status === "completed") {
            clearInterval(pollInterval)
            setIsRecording(false)
            setUserAnswer(response.data.transcription)
          }
        }
      } catch (error) {
        console.error("Error polling for transcription:", error)
        clearInterval(pollInterval)
      }
    }, 2000) // Poll every 2 seconds

    // Clean up interval on component unmount
    return () => clearInterval(pollInterval)
  }

  // Toggle audio playback
  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
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
                      <span className="text-2xl font-bold">{overallScore}%</span>
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
                        <Progress value={Math.min(overallScore + 5, 100)} className="h-2 mb-2" />
                        <p className="text-xs text-gray-400">
                          {overallScore >= 80
                            ? "Strong understanding of core concepts"
                            : overallScore >= 60
                              ? "Good grasp of fundamentals with some gaps"
                              : "Basic understanding needs improvement"}
                        </p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">Communication</h4>
                        <Progress value={Math.min(overallScore - 5, 100)} className="h-2 mb-2" />
                        <p className="text-xs text-gray-400">
                          {overallScore >= 80
                            ? "Clear and concise explanations"
                            : overallScore >= 60
                              ? "Clear explanations with some room for improvement"
                              : "Communication needs more structure and clarity"}
                        </p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">Problem Solving</h4>
                        <Progress value={overallScore} className="h-2 mb-2" />
                        <p className="text-xs text-gray-400">
                          {overallScore >= 80
                            ? "Excellent approach to breaking down problems"
                            : overallScore >= 60
                              ? "Good approach with some inefficiencies"
                              : "Needs more structured problem-solving techniques"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Question Breakdown</h3>
                    <div className="space-y-4">
                      {interview.questions.map((question, index) => {
                        const result = interviewResults[index] || {
                          score: 0,
                          feedback: "No feedback available",
                          suggestions: [],
                        }

                        return (
                          <Card key={index} className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between">
                                <CardTitle className="text-base">Question {index + 1}</CardTitle>
                                <Badge
                                  className={
                                    result.score >= 80
                                      ? "bg-green-500/20 text-green-400"
                                      : result.score >= 60
                                        ? "bg-amber-500/20 text-amber-400"
                                        : "bg-red-500/20 text-red-400"
                                  }
                                >
                                  {result.score >= 80 ? "Strong" : result.score >= 60 ? "Good" : "Needs Work"}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm mb-2">{question}</p>
                              <div className="bg-gray-900 rounded-lg p-3 mb-3">
                                <p className="text-xs text-gray-400 mb-1">Your Answer:</p>
                                <p className="text-sm">
                                  {interview.answers && interview.answers[index]
                                    ? interview.answers[index]
                                    : "No answer recorded"}
                                </p>
                              </div>
                              <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                                <p className="text-xs text-purple-400 mb-1">Feedback:</p>
                                <p className="text-sm text-gray-300">{result.feedback}</p>
                                {result.suggestions && result.suggestions.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-purple-400 mb-1">Suggestions:</p>
                                    <ul className="text-xs text-gray-300">
                                      {result.suggestions.map((suggestion, i) => (
                                        <li key={i} className="mb-1">
                                          • {suggestion}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Areas for Improvement</h3>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {overallScore < 80 && (
                        <>
                          <li>• Provide more concrete examples in your explanations</li>
                          <li>• Deepen your knowledge of advanced concepts</li>
                          <li>• Practice explaining technical concepts more concisely</li>
                        </>
                      )}
                      {overallScore < 60 && (
                        <>
                          <li>• Focus on understanding core fundamentals</li>
                          <li>• Structure your answers with clear beginning, middle, and end</li>
                          <li>• Practice more with technical terminology</li>
                        </>
                      )}
                      {overallScore >= 80 && (
                        <>
                          <li>• Continue to refine your communication skills</li>
                          <li>• Consider exploring more advanced topics in {interview.techstack.join(", ")}</li>
                          <li>• Practice explaining complex concepts to non-technical audiences</li>
                        </>
                      )}
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
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg">{interview.questions[currentQuestionIndex]}</p>
                      {audioRef.current && (
                        <Button variant="outline" size="sm" className="border-gray-700" onClick={toggleAudio}>
                          {isPlaying ? (
                            <>
                              <VolumeX className="h-4 w-4 mr-1" /> Mute
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-4 w-4 mr-1" /> Listen
                            </>
                          )}
                        </Button>
                      )}
                    </div>
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
                        onClick={isRecording ? endVapiCall : startVapiCall}
                        disabled={isAnswering}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-1" /> Stop Interview
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-1" /> Start Voice Interview
                          </>
                        )}
                      </Button>
                    </div>

                    {isRecording && transcription && (
                      <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-3 mb-3">
                        <p className="text-xs text-blue-400 mb-1">Live Transcription:</p>
                        <p className="text-sm">{transcription}</p>
                        <div className="flex items-center mt-2">
                          <RefreshCw className="h-3 w-3 text-blue-400 animate-spin mr-1" />
                          <span className="text-xs text-blue-400">Recording in progress...</span>
                        </div>
                      </div>
                    )}

                    <Textarea
                      id="answer"
                      placeholder="Type your answer here or use voice interview..."
                      className="bg-gray-800 border-gray-700 focus:border-purple-500 min-h-32"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={isAnswering || isRecording}
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
                        <p className="text-sm text-gray-300">{feedbackText}</p>
                        {feedbackSuggestions.length > 0 && (
                          <div className="mt-3 text-sm">
                            <p className="font-medium text-purple-400 mb-1">Suggestions:</p>
                            <ul className="text-gray-300 space-y-1">
                              {feedbackSuggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-1">•</span> {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-700"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0 || isAnswering || isRecording}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  {showFeedback ? (
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={handleNextQuestion}
                      disabled={isAnswering || isRecording}
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
                      disabled={!userAnswer.trim() || isAnswering || isRecording}
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
