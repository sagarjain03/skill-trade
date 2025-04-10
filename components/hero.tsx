import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 my-8">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/20 animate-pulse"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Level Up Your Skills, Together
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Join our community of learners and teachers. Trade skills, earn XP, and climb the ranks in a fun, gamified
          environment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/matches">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Start Your Quest <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/courses">
            <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
              Explore Skills <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
