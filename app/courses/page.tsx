"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Star, Lock, ShoppingCart, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const courses = [
  {
    id: 1,
    title: "Advanced JavaScript Patterns",
    description: "Learn advanced design patterns and techniques in JavaScript",
    author: "CodeMaster",
    authorRank: "S",
    price: 25,
    discount: 20,
    rating: 4.8,
    reviews: 124,
    category: "Programming",
    level: "Advanced",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of effective user interface design",
    author: "DesignPro",
    authorRank: "S",
    price: 30,
    discount: 15,
    rating: 4.9,
    reviews: 89,
    category: "Design",
    level: "Beginner",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Data Science Essentials",
    description: "Introduction to data analysis and visualization techniques",
    author: "DataWizard",
    authorRank: "S",
    price: 35,
    discount: 10,
    rating: 4.7,
    reviews: 156,
    category: "Data",
    level: "Intermediate",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications from scratch",
    author: "AppGuru",
    authorRank: "S",
    price: 40,
    discount: 25,
    rating: 4.6,
    reviews: 78,
    category: "Programming",
    level: "Intermediate",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Machine Learning Fundamentals",
    description: "Get started with machine learning algorithms and applications",
    author: "AIExpert",
    authorRank: "S",
    price: 45,
    discount: 15,
    rating: 4.5,
    reviews: 112,
    category: "Data",
    level: "Advanced",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Web Animation Techniques",
    description: "Create engaging web animations using CSS and JavaScript",
    author: "AnimationPro",
    authorRank: "S",
    price: 20,
    discount: 10,
    rating: 4.7,
    reviews: 65,
    category: "Design",
    level: "Intermediate",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    title: "Backend Development with Node.js",
    description: "Build scalable backend services with Node.js and Express",
    author: "ServerMaster",
    authorRank: "S",
    price: 35,
    discount: 20,
    rating: 4.8,
    reviews: 94,
    category: "Programming",
    level: "Intermediate",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const rankColors = {
  S: "from-yellow-400 to-amber-600",
  A: "from-purple-500 to-purple-700",
  B: "from-blue-500 to-blue-700",
  C: "from-green-500 to-green-700",
  D: "from-orange-500 to-orange-700",
  Beginner: "from-gray-500 to-gray-700",
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const userRank = "B" // Current user's rank

  // Calculate discount based on user rank
  const getDiscount = (baseDiscount: number) => {
    switch (userRank) {
      case "S":
        return baseDiscount + 25
      case "A":
        return baseDiscount + 20
      case "B":
        return baseDiscount + 15
      case "C":
        return baseDiscount + 10
      case "D":
        return baseDiscount + 5
      default:
        return baseDiscount
    }
  }

  // Calculate final price after discount
  const getFinalPrice = (price: number, baseDiscount: number) => {
    const discount = getDiscount(baseDiscount)
    return ((price * (100 - discount)) / 100).toFixed(2)
  }

  // Filter courses based on search query and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory ? course.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = Array.from(new Set(courses.map((course) => course.category)))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <BookOpen className="mr-2 h-6 w-6 text-amber-400" />
        Course Store
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search courses..."
            className="pl-9 bg-gray-900 border-gray-800 focus:border-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "border-gray-800 bg-gray-900",
              selectedCategory === null && "bg-amber-600 hover:bg-amber-700",
            )}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "border-gray-800 bg-gray-900",
                selectedCategory === category && "bg-amber-600 hover:bg-amber-700",
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
            <Star className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Rank Discount</h3>
            <p className="text-sm text-gray-400">
              Your current rank (B) gives you an additional 15% discount on all courses!
            </p>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400">+15% Off</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className={cn(
              "bg-gray-900 border-gray-800 overflow-hidden transition-all duration-300 group",
              (hoveredCourse === course.id || selectedCourse === course.id) &&
                "transform -translate-y-2 shadow-lg shadow-amber-500/10",
            )}
            onMouseEnter={() => setHoveredCourse(course.id)}
            onMouseLeave={() => setHoveredCourse(null)}
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-60"></div>
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 z-20">
                <Badge className="bg-gray-900/80 backdrop-blur-sm text-xs">{course.level}</Badge>
              </div>
              <div className="absolute bottom-2 left-2 z-20 flex items-center">
                <Badge className="bg-gray-900/80 backdrop-blur-sm text-xs">{course.category}</Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base line-clamp-1">{course.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="pb-2">
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">{course.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={course.author} />
                    <AvatarFallback className="text-xs">{course.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-400">{course.author}</span>
                  <div
                    className={cn(
                      "ml-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-gradient-to-br",
                      rankColors[course.authorRank as keyof typeof rankColors],
                    )}
                  >
                    {course.authorRank}
                  </div>
                </div>

                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
                  <span className="text-xs">{course.rating}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-sm font-bold">${getFinalPrice(course.price, course.discount)}</span>
                    <span className="text-xs text-gray-500 line-through ml-2">${course.price}</span>
                  </div>
                  <span className="text-xs text-green-400">{getDiscount(course.discount)}% off</span>
                </div>

                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <ShoppingCart className="h-4 w-4 mr-1" /> Buy
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        <Card className="bg-gray-900 border-gray-800 border-dashed flex flex-col justify-center items-center p-6">
          <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-center">Create Your Own Course</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Reach S rank to unlock the ability to create and sell your own courses
          </p>
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-blue-500 to-blue-700 mr-2">
              B
            </div>
            <div className="w-32 h-2 bg-gray-800 rounded-full">
              <div className="w-3/5 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-yellow-400 to-amber-600 ml-2 opacity-50">
              S
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
