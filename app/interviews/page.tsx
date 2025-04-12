"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, CheckCircle, ArrowRight, Code, Briefcase, Calendar, Brain, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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

export default function InterviewsPage() {
  const [showParticles, setShowParticles] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

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

  // Filter interviews based on search query and filter type
  const filteredInterviews = dummyInterviews.filter((interview) => {
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
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 mb-8">
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
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    AI-powered questions tailored to your experience level
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Detailed feedback on your responses
                  </li>
                  <li className="flex items-center text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Track your progress over time
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

          {filteredInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInterviews.map((interview) => (
                <Card
                  key={interview.id}
                  className={cn(
                    "bg-gray-900 border-gray-800 hover:border-gray-700 transition-all",
                    interview.finalized ? "border-green-500/20" : "border-amber-500/20",
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
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
                      <Badge
                        className={cn(
                          interview.finalized ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400",
                        )}
                      >
                        {interview.finalized ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2">{interview.role}</CardTitle>
                    <CardDescription>{interview.level} Level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Code className="h-4 w-4 mr-1 text-gray-400" /> Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {interview.techstack.map((tech, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-800 text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 text-gray-400" /> Questions
                        </h4>
                        <p className="text-sm text-gray-400">{interview.questions.length} questions</p>
                      </div>

                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(interview.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/interviews/${interview.id}`} className="w-full">
                      <Button
                        className={cn(
                          "w-full",
                          interview.finalized
                            ? "bg-gray-800 hover:bg-gray-700"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                        )}
                      >
                        {interview.finalized ? (
                          <>
                            View Results <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Continue Interview <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </Link>
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

          {filteredInterviews.length > 0 && filteredInterviews.length < dummyInterviews.length && (
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

        {/* Stats Section */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle>Your Interview Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{dummyInterviews.length}</div>
                  <div className="text-xs text-gray-400">Total Interviews</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {dummyInterviews.filter((interview) => interview.finalized).length}
                  </div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {dummyInterviews.filter((interview) => !interview.finalized).length}
                  </div>
                  <div className="text-xs text-gray-400">In Progress</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <Code className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {dummyInterviews.filter((interview) => interview.type === "Technical").length}
                  </div>
                  <div className="text-xs text-gray-400">Technical Interviews</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
