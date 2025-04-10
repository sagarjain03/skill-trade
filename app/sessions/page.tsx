"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MessageCircle, Video, Star } from "lucide-react"
import RatingStars from "@/components/rating-stars"
import { cn } from "@/lib/utils"

export default function SessionsPage() {
  const [activeSession, setActiveSession] = useState<number | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Calendar className="mr-2 h-6 w-6 text-pink-400" />
        Your Sessions
      </h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                type: "teaching",
                skill: "React",
                partner: "WebDev101",
                partnerRank: "C",
                date: "Tomorrow",
                time: "3:00 PM",
                duration: "60 min",
                mode: "video",
              },
              {
                id: 2,
                type: "learning",
                skill: "Python",
                partner: "DataWizard",
                partnerRank: "A",
                date: "Friday",
                time: "5:30 PM",
                duration: "45 min",
                mode: "video",
              },
              {
                id: 3,
                type: "teaching",
                skill: "JavaScript",
                partner: "CodeNewbie",
                partnerRank: "D",
                date: "Next Monday",
                time: "4:15 PM",
                duration: "60 min",
                mode: "chat",
              },
            ].map((session) => (
              <Card key={session.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className={cn("h-2 w-full", session.type === "teaching" ? "bg-blue-600" : "bg-purple-600")}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge
                      className={cn(
                        session.type === "teaching"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400",
                      )}
                    >
                      {session.type === "teaching" ? "Teaching" : "Learning"}
                    </Badge>
                    <Badge className="bg-gray-800">{session.mode === "video" ? "Video Call" : "Chat"}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-2">{session.skill}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={session.partner} />
                      <AvatarFallback>{session.partner.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{session.partner}</span>
                        <div className="ml-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-purple-700">
                          {session.partnerRank}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {session.type === "teaching" ? "Your student" : "Your teacher"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {session.time} ({session.duration})
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className={cn(
                        "flex-1",
                        session.mode === "video"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
                      )}
                    >
                      {session.mode === "video" ? (
                        <>
                          <Video className="h-4 w-4 mr-2" /> Join Call
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" /> Open Chat
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="border-gray-700">
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 4,
                type: "teaching",
                skill: "JavaScript",
                partner: "CodeNewbie",
                partnerRank: "D",
                date: "2 days ago",
                duration: "60 min",
                rated: true,
                rating: "gold",
                xp: "+10",
              },
              {
                id: 5,
                type: "learning",
                skill: "Python",
                partner: "DataWizard",
                partnerRank: "A",
                date: "1 week ago",
                duration: "45 min",
                rated: true,
                rating: "gold",
                xp: "+10",
              },
              {
                id: 6,
                type: "teaching",
                skill: "React",
                partner: "WebDev101",
                partnerRank: "C",
                date: "2 weeks ago",
                duration: "60 min",
                rated: true,
                rating: "silver",
                xp: "0",
              },
              {
                id: 7,
                type: "learning",
                skill: "Data Science",
                partner: "AnalyticsGuru",
                partnerRank: "S",
                date: "3 weeks ago",
                duration: "90 min",
                rated: false,
              },
            ].map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "bg-gray-900 border-gray-800 overflow-hidden",
                  activeSession === session.id && "ring-1 ring-pink-500/50",
                )}
              >
                <div className={cn("h-2 w-full", session.type === "teaching" ? "bg-blue-600" : "bg-purple-600")}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge
                      className={cn(
                        session.type === "teaching"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400",
                      )}
                    >
                      {session.type === "teaching" ? "Taught" : "Learned"}
                    </Badge>
                    {session.rated ? (
                      <div className="flex space-x-1">
                        <div
                          className={cn(
                            "h-6 px-2 rounded-full flex items-center text-xs font-medium",
                            session.rating === "gold"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : session.rating === "silver"
                                ? "bg-gray-500/20 text-gray-400"
                                : "bg-gray-900/20 text-gray-500",
                          )}
                        >
                          {session.rating === "gold" ? "Gold" : session.rating === "silver" ? "Silver" : "Black"}
                        </div>
                        <div
                          className={cn(
                            "h-6 px-2 rounded-full flex items-center text-xs font-medium",
                            session.xp?.startsWith("+")
                              ? "bg-green-500/20 text-green-400"
                              : session.xp?.startsWith("-")
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400",
                          )}
                        >
                          {session.xp} XP
                        </div>
                      </div>
                    ) : (
                      <Badge className="bg-amber-500/20 text-amber-400">Needs Rating</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl mt-2">{session.skill}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={session.partner} />
                      <AvatarFallback>{session.partner.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{session.partner}</span>
                        <div className="ml-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-purple-700">
                          {session.partnerRank}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {session.date} • {session.duration}
                      </span>
                    </div>
                  </div>

                  {!session.rated ? (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Star className="h-4 w-4 mr-1 text-amber-400" /> Rate this session
                      </h4>
                      <RatingStars />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gray-800 hover:bg-gray-700"
                        onClick={() => setActiveSession(activeSession === session.id ? null : session.id)}
                      >
                        {activeSession === session.id ? "Hide Details" : "View Details"}
                      </Button>

                      {activeSession === session.id && (
                        <div className="bg-gray-800 rounded-lg p-3 text-sm">
                          <h4 className="font-medium mb-2">Session Notes</h4>
                          <p className="text-gray-400 text-xs">
                            {session.type === "teaching"
                              ? `You taught ${session.partner} about ${session.skill}. The session covered basic concepts and practical examples.`
                              : `You learned about ${session.skill} from ${session.partner}. The session was informative and well-structured.`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 8,
                type: "teaching",
                skill: "UI Design",
                partner: "DesignNewbie",
                partnerRank: "D",
                status: "requested",
              },
              {
                id: 9,
                type: "learning",
                skill: "Machine Learning",
                partner: "AIExpert",
                partnerRank: "S",
                status: "pending",
              },
            ].map((session) => (
              <Card key={session.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className={cn("h-2 w-full", session.type === "teaching" ? "bg-blue-600" : "bg-purple-600")}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge
                      className={cn(
                        session.type === "teaching"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400",
                      )}
                    >
                      {session.type === "teaching" ? "Teaching" : "Learning"}
                    </Badge>
                    <Badge
                      className={cn(
                        session.status === "requested"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-blue-500/20 text-blue-400",
                      )}
                    >
                      {session.status === "requested" ? "Action Required" : "Awaiting Response"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-2">{session.skill}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={session.partner} />
                      <AvatarFallback>{session.partner.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{session.partner}</span>
                        <div className="ml-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-purple-700">
                          {session.partnerRank}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {session.status === "requested" ? "Requested a session with you" : "You requested a session"}
                      </span>
                    </div>
                  </div>

                  {session.status === "requested" ? (
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">Accept</Button>
                      <Button variant="outline" className="flex-1 border-gray-700">
                        Decline
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-400 mb-3">
                        You've requested a session. Waiting for {session.partner} to respond.
                      </p>
                      <Button variant="outline" className="w-full border-gray-700">
                        Cancel Request
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
