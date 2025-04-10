"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, MessageCircle, Award, Plus, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const posts = [
  {
    id: 1,
    author: "SkillMaster42",
    authorRank: "B",
    content:
      "Has anyone found a good resource for learning advanced React patterns? I'm struggling with custom hooks and context.",
    likes: 12,
    comments: 5,
    time: "2 hours ago",
    tags: ["React", "JavaScript", "Help"],
  },
  {
    id: 2,
    author: "DesignGuru",
    authorRank: "A",
    content:
      "Just completed my first UI/UX course on SkillQuest! The gamification really kept me motivated throughout. Highly recommend checking out @DesignPro's courses.",
    likes: 24,
    comments: 8,
    time: "5 hours ago",
    tags: ["Design", "Success", "Recommendation"],
  },
  {
    id: 3,
    author: "CodeNewbie",
    authorRank: "D",
    content: "Looking for a study buddy for the Python Data Science track. Anyone interested in pairing up?",
    likes: 7,
    comments: 15,
    time: "1 day ago",
    tags: ["Python", "DataScience", "StudyBuddy"],
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

const rankBorderColors = {
  S: "border-yellow-400",
  A: "border-purple-500",
  B: "border-blue-500",
  C: "border-green-500",
  D: "border-orange-500",
  Beginner: "border-gray-500",
}

export default function CommunityBoard() {
  const [newPost, setNewPost] = useState("")
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-2 h-6 w-6 text-green-400" />
        Community Guild
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Create Post</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your thoughts, ask for help, or celebrate your achievements..."
                className="bg-gray-800 border-gray-700 focus:border-green-500 min-h-24"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs border-gray-700 bg-gray-800">
                  <Plus className="h-3 w-3 mr-1" /> Tag
                </Button>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" /> Post
              </Button>
            </CardFooter>
          </Card>

          {posts.map((post) => (
            <Card
              key={post.id}
              className={cn(
                "bg-gray-900 border-gray-800 transition-all duration-300",
                expandedPost === post.id && "ring-1 ring-green-500/50",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar
                      className={cn(
                        "h-8 w-8 mr-2 border",
                        rankBorderColors[post.authorRank as keyof typeof rankBorderColors],
                      )}
                    >
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={post.author} />
                      <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-sm">{post.author}</span>
                        <div
                          className={cn(
                            "ml-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-gradient-to-br",
                            rankColors[post.authorRank as keyof typeof rankColors],
                          )}
                        >
                          {post.authorRank}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm mb-3">{post.content}</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-800 text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("text-xs flex items-center", likedPosts.includes(post.id) && "text-green-400")}
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center"
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {post.comments}
                  </Button>
                </div>
              </CardFooter>

              {expandedPost === post.id && (
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-gray-800 pt-4 space-y-4">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Your avatar" />
                        <AvatarFallback>YO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-800 rounded-lg p-2">
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium">You</span>
                            <div className="ml-1 h-3 w-3 rounded-full flex items-center justify-center text-[8px] font-bold bg-gradient-to-br from-blue-500 to-blue-700">
                              B
                            </div>
                          </div>
                          <p className="text-xs">
                            I recommend checking out the React documentation on custom hooks. It's really helpful!
                          </p>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>Just now</span>
                          <span className="mx-1">•</span>
                          <Button variant="ghost" size="sm" className="h-4 px-1 text-[10px]">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Your avatar" />
                        <AvatarFallback>YO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write a comment..."
                          className="bg-gray-800 border-gray-700 focus:border-green-500 min-h-8 text-xs py-2"
                          rows={2}
                        />
                        <div className="flex justify-end mt-2">
                          <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Guild Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "MasterCoder", rank: "S", points: 12450, avatar: "/placeholder.svg?height=40&width=40" },
                  { name: "DesignGuru", rank: "A", points: 8320, avatar: "/placeholder.svg?height=40&width=40" },
                  { name: "DataWizard", rank: "A", points: 7890, avatar: "/placeholder.svg?height=40&width=40" },
                  { name: "WebDev101", rank: "B", points: 5430, avatar: "/placeholder.svg?height=40&width=40" },
                  {
                    name: "You",
                    rank: "B",
                    points: 2450,
                    avatar: "/placeholder.svg?height=40&width=40",
                    isCurrentUser: true,
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center p-2 rounded-lg",
                      user.isCurrentUser ? "bg-green-500/10 border border-green-500/30" : "hover:bg-gray-800",
                    )}
                  >
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-800 text-xs font-medium mr-2">
                      {index + 1}
                    </div>
                    <Avatar
                      className={cn(
                        "h-8 w-8 mr-2 border",
                        rankBorderColors[user.rank as keyof typeof rankBorderColors],
                      )}
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{user.name}</span>
                        <div
                          className={cn(
                            "ml-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-gradient-to-br",
                            rankColors[user.rank as keyof typeof rankColors],
                          )}
                        >
                          {user.rank}
                        </div>
                        {index === 0 && (
                          <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 text-[10px]">
                            <Award className="h-2 w-2 mr-1" /> Top Contributor
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{user.points.toLocaleString()} points</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Quests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Help 5 community members", reward: 100, progress: 3, total: 5 },
                  { title: "Complete 3 skill exchanges", reward: 150, progress: 1, total: 3 },
                  { title: "Rate 10 learning sessions", reward: 200, progress: 7, total: 10 },
                ].map((quest, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium">{quest.title}</h3>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">+{quest.reward} XP</Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      {quest.progress}/{quest.total} completed
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
