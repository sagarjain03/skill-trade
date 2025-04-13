"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, CheckCircle, Code, Briefcase, Calendar, Brain, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import axios from "@/lib/axios" // Import Axios instance
import { useParams, useRouter } from "next/navigation"

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

export default function InterviewsPage() {
  const params = useParams()
  const [showParticles, setShowParticles] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [interviews, setInterview] = useState<Interview[]>([]) // Replace dummyInterviews with fetched data
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch interviews from the API
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get("/interviews")
        if (response.data.success) {
          setInterview(response.data.interviews)
        }
      } catch (error) {
        console.error("Failed to fetch interviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  const handleUpdate = async (id: string) => {
    const confirmed = confirm("Are you sure you want to update this interview?")
    if (!confirmed) return

    setIsUpdating(true)
    try {
      const response = await axios.put(`/interviews/${id}`, {
        role: "Updated Role", // Modify with form or prompt if needed
        type: "Updated Type",
      })

      if (response.data.success) {
        // Update the interview in the local state
        setInterview((prev) => prev.map((int) => (int.id === id ? response.data.interview : int)))
        alert("Interview updated successfully!")
      } else {
        console.error("Failed to update interview:", response.data.error)
      }
    } catch (error) {
      console.error("Error updating interview:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this interview? This action cannot be undone.")
    if (!confirmed) return

    setIsDeleting(id)
    try {
      const response = await axios.delete(`/interviews/${id}`)
      if (response.data.success) {
        // Remove the deleted interview from local state
        setInterview((prev) => prev.filter((int) => int.id !== id))
      } else {
        console.error("Failed to delete interview:", response.data.error)
      }
    } catch (error) {
      console.error("Error deleting interview:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  // Filter interviews based on search query and filter type
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.techstack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = filterType ? interview.type === filterType : true

    return matchesSearch && matchesType
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get counts for different interview types
  const technicalCount = interviews.filter((i) => i.type === "Technical").length
  const behavioralCount = interviews.filter((i) => i.type === "Behavioral").length
  const portfolioCount = interviews.filter((i) => i.type === "Portfolio").length
  const completedCount = interviews.filter((i) => i.finalized).length
  const inProgressCount = interviews.filter((i) => !i.finalized).length

  useEffect(() => {
    // Delay the particles animation for a smoother load
    const timer = setTimeout(() => {
      setShowParticles(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Brain className="mr-2 h-6 w-6 text-purple-400" />
          Interview Quest
        </h1>
        <p className="text-gray-400 mb-8">Practice interviews to level up your career skills</p>

        {/* Start Interview Section */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 mb-8 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Ready for Your Next Challenge?
                </h2>
                <p className="text-gray-300 mb-4">
                  Start a new interview session to practice your skills and prepare for real-world interviews. Choose
                  from technical, behavioral, or portfolio interview types.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    <span>AI-powered questions tailored to your experience level</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    <span>Detailed feedback on your responses</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    <span>Track your progress over time</span>
                  </li>
                </ul>
                <Link href="/interviews/new">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <PlayCircle className="mr-2 h-5 w-5" /> Start New Interview
                  </Button>
                </Link>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping opacity-30"></div>
                  <div className="relative h-48 w-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center">
                    <div className="h-36 w-36 bg-gray-800 rounded-full flex items-center justify-center">
                      <Brain className="h-16 w-16 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle>Your Interview Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{interviews.length}</div>
                  <div className="text-xs text-gray-400">Total Interviews</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{inProgressCount}</div>
                  <div className="text-xs text-gray-400">In Progress</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <Code className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{technicalCount}</div>
                  <div className="text-xs text-gray-400">Technical Interviews</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Interviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Interview History</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search interviews..."
                className="pl-9 bg-gray-900 border-gray-800 focus:border-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button
                variant={filterType === null ? "default" : "outline"}
                className={cn(
                  "border-gray-800 bg-gray-900",
                  filterType === null && "bg-purple-600 hover:bg-purple-700",
                )}
                onClick={() => setFilterType(null)}
              >
                All
              </Button>
              {["Technical", "Behavioral", "Portfolio"].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  className={cn(
                    "border-gray-800 bg-gray-900",
                    filterType === type && "bg-purple-600 hover:bg-purple-700",
                  )}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
              <span className="ml-2 text-gray-400">Loading interviews...</span>
            </div>
          ) : filteredInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInterviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-200 overflow-hidden"
                >
                  <div
                    className={cn(
                      "h-1 w-full",
                      interview.type === "Technical"
                        ? "bg-blue-600"
                        : interview.type === "Behavioral"
                          ? "bg-green-600"
                          : "bg-amber-600",
                    )}
                  ></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{interview.role}</CardTitle>
                      <Badge
                        className={cn(
                          "text-xs",
                          interview.finalized ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400",
                        )}
                      >
                        {interview.finalized ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400 flex items-center">
                      {interview.type === "Technical" ? (
                        <Code className="h-3 w-3 mr-1" />
                      ) : interview.type === "Behavioral" ? (
                        <Briefcase className="h-3 w-3 mr-1" />
                      ) : (
                        <Calendar className="h-3 w-3 mr-1" />
                      )}
                      {interview.type} • {interview.level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {interview.techstack.map((tech, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-800 text-xs border-gray-700">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        <Brain className="h-3 w-3 mr-1 text-purple-400" />
                        <span>{interview.questions.length} questions</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(interview.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/interviews/${interview.id}`)}
                      className="flex-1 border-gray-700 hover:bg-gray-800"
                    >
                      View
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate(interview.id)}
                        disabled={isUpdating}
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-950 hover:text-blue-300"
                      >
                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Edit"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(interview.id)}
                        disabled={isDeleting === interview.id}
                        className="border-red-500/50 text-red-400 hover:bg-red-950 hover:text-red-300"
                      >
                        {isDeleting === interview.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-800 p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">No interviews found</h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery || filterType
                    ? "Try adjusting your search or filters"
                    : "Start your first interview to begin practicing"}
                </p>
                {(searchQuery || filterType) && (
                  <Button
                    variant="outline"
                    className="border-gray-700"
                    onClick={() => {
                      setSearchQuery("")
                      setFilterType(null)
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          )}

          {filteredInterviews.length > 0 && filteredInterviews.length < interviews.length && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="border-gray-700"
                onClick={() => {
                  setSearchQuery("")
                  setFilterType(null)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Interview Types Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Interview Types</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Code className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle>Technical</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Practice coding challenges, system design, and technical knowledge questions to prepare for technical
                  interviews.
                </p>
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Your progress</span>
                    <Badge className="bg-blue-500/20 text-blue-400">{technicalCount} interviews</Badge>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${interviews.length > 0 ? (technicalCount / interviews.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/interviews/new?type=Technical")}
                >
                  Start Technical Interview
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <Briefcase className="h-5 w-5 text-green-400" />
                  </div>
                  <CardTitle>Behavioral</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Practice answering questions about your experience, teamwork, conflict resolution, and other soft
                  skills.
                </p>
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Your progress</span>
                    <Badge className="bg-green-500/20 text-green-400">{behavioralCount} interviews</Badge>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${interviews.length > 0 ? (behavioralCount / interviews.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => router.push("/interviews/new?type=Behavioral")}
                >
                  Start Behavioral Interview
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-amber-500/50 transition-all duration-200">
              <CardHeader>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-amber-400" />
                  </div>
                  <CardTitle>Portfolio</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Practice discussing your projects, explaining your design decisions, and showcasing your work
                  effectively.
                </p>
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Your progress</span>
                    <Badge className="bg-amber-500/20 text-amber-400">{portfolioCount} interviews</Badge>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${interviews.length > 0 ? (portfolioCount / interviews.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => router.push("/interviews/new?type=Portfolio")}
                >
                  Start Portfolio Interview
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
