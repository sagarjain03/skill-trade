import Hero from "@/components/hero"
import UserDashboard from "@/components/user-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Brain, MessageSquare, Sparkles, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <UserDashboard />

      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-6">Explore SkillQuest</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="mb-4 h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find Matches</h3>
              <p className="text-gray-400 mb-4">
                Connect with users who have complementary skills. You teach what you know, and learn what you want.
              </p>
              <Link href="/matches">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Find Matches <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-amber-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="mb-4 h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <BookOpen className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Course Store</h3>
              <p className="text-gray-400 mb-4">
                Browse and purchase courses created by S-rank users. The higher your rank, the bigger your discount.
              </p>
              <Link href="/courses">
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="mb-4 h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <MessageSquare className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Guild</h3>
              <p className="text-gray-400 mb-4">
                Join our community board to ask questions, share knowledge, and help fellow learners on their journey.
              </p>
              <Link href="/community">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Join Community <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Skill Challenges</h3>
              <p className="text-gray-400 mb-4">
                Test your knowledge with our AI-powered skill challenges. Earn XP and get personalized feedback.
              </p>
              <Link href="/challenges">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Take Challenges <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-pink-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="mb-4 h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                <Users className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your Sessions</h3>
              <p className="text-gray-400 mb-4">
                View your upcoming and past learning sessions. Rate your experiences and track your progress.
              </p>
              <Link href="/sessions">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                  View Sessions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
