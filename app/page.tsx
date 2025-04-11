"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Award, BookOpen, Brain, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const router = useRouter()
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    // Delay the particles animation for a smoother load
    const timer = setTimeout(() => {
      setShowParticles(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleRegister = () => {
    router.push("/register")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
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

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-purple-600 rounded-2xl rotate-45 transform origin-center"></div>
          <div className="absolute inset-2 bg-blue-500 rounded-xl rotate-12 transform origin-center"></div>
          <div className="absolute inset-4 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-3xl">SQ</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          SkillQuest
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
          Level up your skills through gamified learning and teaching
        </p>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Join our community of learners and teachers. Trade skills, earn XP, and climb the ranks in a fun, gamified
          environment designed to make skill development an adventure.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button
            size="lg"
            onClick={handleRegister}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
          >
            Start Your Quest <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleLogin}
            className="border-gray-700 hover:bg-gray-800 text-lg px-8"
          >
            Continue Journey
          </Button>
        </div>

        {/* Rank Showcase */}
        <div className="flex justify-center mb-16 overflow-x-auto pb-4 max-w-full">
          <div className="flex space-x-4">
            {[
              { rank: "D", color: "from-orange-500 to-orange-700", label: "Beginner" },
              { rank: "C", color: "from-green-500 to-green-700", label: "Apprentice" },
              { rank: "B", color: "from-blue-500 to-blue-700", label: "Adept" },
              { rank: "A", color: "from-purple-500 to-purple-700", label: "Expert" },
              { rank: "S", color: "from-yellow-400 to-amber-600", label: "Master" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold bg-gradient-to-br ${item.color} mb-2`}
                >
                  {item.rank}
                </div>
                <span className="text-sm text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Embark on Your Skill Adventure</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors group">
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Skill Matching</h3>
                <p className="text-gray-400 mb-4">
                  Our intelligent system pairs you with users who have complementary skills. Teach what you know, learn
                  what you want.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-amber-500/50 transition-colors group">
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                  <Award className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rank System</h3>
                <p className="text-gray-400 mb-4">
                  Earn XP through teaching, learning, and community participation. Level up from Rank D to the coveted
                  Rank S.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors group">
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <MessageSquare className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community Guild</h3>
                <p className="text-gray-400 mb-4">
                  Join our vibrant community to ask questions, share knowledge, and collaborate with fellow skill
                  questers.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors group">
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Skill Challenges</h3>
                <p className="text-gray-400 mb-4">
                  Test your knowledge with our AI-powered challenges. Earn XP and get personalized feedback on your
                  strengths and areas for improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-pink-500/50 transition-colors group">
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                  <BookOpen className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Course Marketplace</h3>
                <p className="text-gray-400 mb-4">
                  Browse and purchase courses created by high-ranking members. The higher your rank, the bigger your
                  discount.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Questers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "SkillQuest transformed how I learn new skills. The gamification keeps me motivated, and I've made great connections!",
                name: "Alex Chen",
                rank: "B",
                skills: "JavaScript, React",
              },
              {
                quote:
                  "Teaching others has deepened my own understanding. The rank system gives me tangible goals to work toward.",
                name: "Maya Johnson",
                rank: "A",
                skills: "UI/UX Design",
              },
              {
                quote:
                  "The AI challenges helped me identify gaps in my knowledge. I've improved more in 3 months than in a year of self-study.",
                name: "Raj Patel",
                rank: "C",
                skills: "Python, Data Science",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-700 flex items-center justify-center text-sm font-bold mr-3">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{testimonial.name}</p>
                        <div className="ml-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-blue-500 to-blue-700">
                          {testimonial.rank}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{testimonial.skills}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/30 to-blue-900/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Quest?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of skill questers who are learning, teaching, and leveling up together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={handleRegister}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleLogin} className="border-gray-700 hover:bg-gray-800">
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-purple-600 rounded-lg rotate-45 transform origin-center"></div>
                <div className="absolute inset-1 bg-blue-500 rounded-lg rotate-12 transform origin-center"></div>
                <div className="absolute inset-2 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SQ</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                SkillQuest
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Help
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-sm text-gray-500">
            © 2025 SkillQuest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
