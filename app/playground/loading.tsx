import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-45 transform origin-center animate-pulse"></div>
        <div className="absolute inset-2 bg-purple-500 rounded-xl rotate-12 transform origin-center animate-pulse delay-100"></div>
        <div className="absolute inset-4 bg-gray-900 rounded-lg flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Loading Quantum Playground
      </h2>
      <p className="text-gray-400">Initializing code environment...</p>
    </div>
  )
}
