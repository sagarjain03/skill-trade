"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  onChange?: (rating: number, type: "gold" | "silver" | "black") => void
  disabled?: boolean
}

export default function RatingStars({ onChange, disabled = false }: RatingStarsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<"gold" | "silver" | "black">("gold")
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleRatingClick = (rating: number) => {
    if (disabled) return

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 700)

    setSelectedRating(rating)
    onChange?.(rating, selectedType)
  }

  const handleTypeChange = (type: "gold" | "silver" | "black") => {
    if (disabled) return
    setSelectedType(type)
    if (selectedRating) {
      onChange?.(selectedRating, type)
    }
  }

  const getStarColor = (index: number) => {
    const isActive = hoverRating !== null ? index <= hoverRating : index <= (selectedRating || 0)

    if (!isActive) return "text-gray-600"

    switch (selectedType) {
      case "gold":
        return "text-yellow-400"
      case "silver":
        return "text-gray-400"
      case "black":
        return "text-gray-900"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleTypeChange("gold")}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
            selectedType === "gold"
              ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
              : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700",
          )}
        >
          Gold (+10 XP)
        </button>
        <button
          onClick={() => handleTypeChange("silver")}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
            selectedType === "silver"
              ? "bg-gray-400/20 text-gray-300 border border-gray-400/50"
              : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700",
          )}
        >
          Silver (0 XP)
        </button>
        <button
          onClick={() => handleTypeChange("black")}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
            selectedType === "black"
              ? "bg-gray-900 text-gray-400 border border-gray-600"
              : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700",
          )}
        >
          Black (-10 XP)
        </button>
      </div>

      <div className="flex justify-center space-x-1">
        {[1, 2, 3].map((index) => (
          <button
            key={index}
            disabled={disabled}
            onClick={() => handleRatingClick(index)}
            onMouseEnter={() => setHoverRating(index)}
            onMouseLeave={() => setHoverRating(null)}
            className={cn("transition-transform relative", isAnimating && selectedRating === index && "animate-bounce")}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                getStarColor(index),
                selectedType === "black" && index <= (selectedRating || 0) && "fill-gray-900",
                selectedType === "gold" && index <= (selectedRating || 0) && "fill-yellow-400",
                selectedType === "silver" && index <= (selectedRating || 0) && "fill-gray-400",
              )}
            />
            {isAnimating && selectedRating === index && selectedType === "gold" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
            )}
          </button>
        ))}
      </div>

      {selectedRating && (
        <div className="text-center text-sm">
          {selectedType === "gold" && <span className="text-green-400">+10 XP awarded!</span>}
          {selectedType === "silver" && <span className="text-gray-400">0 XP (neutral rating)</span>}
          {selectedType === "black" && <span className="text-red-400">-10 XP deducted</span>}
        </div>
      )}
    </div>
  )
}
