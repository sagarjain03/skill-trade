"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, BookOpen, Users, Zap, Settings, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import axios from "axios";
import { useState, useEffect } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

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

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const currentUser = useAppSelector((state) => state.user.currentUser)

  const rank = "B"
  const nextRank = "A"
  const xpCurrent = 2450
  const xpRequired = 3000

  // Fetch the username from the profile route
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/users/profile");
        setUsername(response.data.user.username); 
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
  
    fetchProfile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-1/3">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Profile</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className={cn("h-24 w-24 border-2", rankBorderColors[rank])}>
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="@username" />
                    <AvatarFallback className="bg-gray-700 text-2xl">UN</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -bottom-2 -right-2 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold bg-gradient-to-br",
                      rankColors[rank],
                    )}
                  >
                    {rank}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6 rounded-full bg-gray-800"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">{username || "Loading..."}</h2>
                <p className="text-sm text-gray-400 mb-2">Joined 3 months ago</p>
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  <Badge variant="outline" className="bg-gray-800">
                    JavaScript
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800">
                    React
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800">
                    UI Design
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-800 border-dashed flex items-center gap-1 hover:bg-gray-700 cursor-pointer"
                  >
                    <Plus  className="h-3 w-3" /> Add Skill
                  </Badge>
                </div>

                <div className="w-full bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 bg-gradient-to-br",
                          rankColors[rank],
                        )}
                      >
                        {rank}
                      </div>
                      <span className="text-sm">Current Rank</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">Next Rank</span>
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ml-2 bg-gradient-to-br opacity-70",
                          rankColors[nextRank],
                        )}
                      >
                        {nextRank}
                      </div>
                    </div>
                  </div>

                  <Progress value={(xpCurrent / xpRequired) * 100} className="h-3 mb-2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white">
                        {xpCurrent} / {xpRequired} XP
                      </span>
                    </div>
                  </Progress>

                  <div className="text-xs text-gray-400 text-center">
                    {xpRequired - xpCurrent} XP needed for next rank
                  </div>
                </div>

                <div className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">12</div>
                    <div className="text-xs text-gray-400">Skills Learned</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">8</div>
                    <div className="text-xs text-gray-400">Skills Taught</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">24</div>
                    <div className="text-xs text-gray-400">Sessions</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                    <Award className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">5</div>
                    <div className="text-xs text-gray-400">Achievements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid grid-cols-3 bg-gray-900 border border-gray-800">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "First Steps",
                        description: "Complete your first skill exchange session",
                        icon: <Award className="h-5 w-5 text-yellow-400" />,
                        color: "from-yellow-600 to-amber-600",
                        completed: true,
                        xp: 50,
                      },
                      {
                        title: "Helpful Hand",
                        description: "Receive 5 positive ratings as a teacher",
                        icon: <Award className="h-5 w-5 text-purple-400" />,
                        color: "from-purple-600 to-pink-600",
                        completed: true,
                        xp: 100,
                      },
                      {
                        title: "Knowledge Seeker",
                        description: "Learn 5 different skills",
                        icon: <Award className="h-5 w-5 text-blue-400" />,
                        color: "from-blue-600 to-cyan-600",
                        completed: true,
                        xp: 100,
                      },
                      {
                        title: "Community Pillar",
                        description: "Answer 10 questions in the community guild",
                        icon: <Award className="h-5 w-5 text-green-400" />,
                        color: "from-green-600 to-emerald-600",
                        completed: false,
                        progress: 7,
                        total: 10,
                        xp: 150,
                      },
                      {
                        title: "Challenge Master",
                        description: "Complete 5 AI skill challenges with a score of 80% or higher",
                        icon: <Award className="h-5 w-5 text-red-400" />,
                        color: "from-red-600 to-orange-600",
                        completed: false,
                        progress: 3,
                        total: 5,
                        xp: 200,
                      },
                      {
                        title: "Course Creator",
                        description: "Reach S rank and create your first course",
                        icon: <Award className="h-5 w-5 text-gray-400" />,
                        color: "from-gray-600 to-gray-700",
                        completed: false,
                        locked: true,
                        xp: 500,
                      },
                    ].map((achievement, index) => (
                      <div
                        key={index}
                        className={cn(
                          "bg-gray-800 rounded-lg p-4 border border-gray-700",
                          achievement.completed && "border-green-500/30",
                          achievement.locked && "opacity-50",
                        )}
                      >
                        <div className="flex items-start">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br",
                              achievement.color,
                            )}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold">{achievement.title}</h3>
                              <Badge className="bg-green-500/20 text-green-400">+{achievement.xp} XP</Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                            {achievement.completed ? (
                              <Badge className="mt-2 bg-green-500/20 text-green-400">Completed</Badge>
                            ) : achievement.locked ? (
                              <Badge className="mt-2 bg-gray-700 text-gray-400">Locked</Badge>
                            ) : (
                              <div className="mt-2">
                                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-400 text-right">
                                  {achievement.progress}/{achievement.total} completed
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="skills">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Your Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Skills You Can Teach</h3>
                      <SkillsDropdown currentSkills={currentUser?.skillsToTeach || []} type="skillsToTeach" />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Skills You Want to Learn</h3>
                      <SkillsDropdown currentSkills={currentUser?.skillsToLearn || []} type="skillsToLearn" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "taught",
                        skill: "JavaScript",
                        partner: "CodeNewbie",
                        date: "2 days ago",
                        rating: "gold",
                        xp: "+10",
                      },
                      {
                        type: "learned",
                        skill: "Python",
                        partner: "DataWizard",
                        date: "1 week ago",
                        rating: "gold",
                        xp: "+10",
                      },
                      {
                        type: "taught",
                        skill: "React",
                        partner: "WebDev101",
                        date: "2 weeks ago",
                        rating: "silver",
                        xp: "0",
                      },
                      {
                        type: "learned",
                        skill: "Data Science",
                        partner: "AnalyticsGuru",
                        date: "3 weeks ago",
                        rating: "gold",
                        xp: "+10",
                      },
                    ].map((session, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <Badge
                                className={cn(
                                  session.type === "taught"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-purple-500/20 text-purple-400",
                                )}
                              >
                                {session.type === "taught" ? "Taught" : "Learned"}
                              </Badge>
                              <span className="ml-2 font-medium">{session.skill}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              With {session.partner} • {session.date}
                            </p>
                          </div>
                          <div className="flex items-center">
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
                              {session.rating === "gold"
                                ? "Gold Rating"
                                : session.rating === "silver"
                                  ? "Silver Rating"
                                  : "Black Rating"}
                            </div>
                            <div
                              className={cn(
                                "ml-2 h-6 px-2 rounded-full flex items-center text-xs font-medium",
                                session.xp.startsWith("+")
                                  ? "bg-green-500/20 text-green-400"
                                  : session.xp.startsWith("-")
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-gray-500/20 text-gray-400",
                              )}
                            >
                              {session.xp} XP
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function SkillsDropdown({
  currentSkills,
  type,
}: {
  currentSkills: string[];
  type: "skillsToTeach" | "skillsToLearn";
}) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentSkills);
  const [loading, setLoading] = useState(false);

  const techOptions = [
    "JavaScript",
    "React",
    "Python",
    "Node.js",
    "UI Design",
    "Data Science",
    "Machine Learning",
  ];

  // Handle skill selection/deselection
  const handleSkillChange = (skill: string) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill) // Remove skill if already selected
        : [...prevSkills, skill] // Add skill if not selected
    );
  };

  // Save selected skills to the backend
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/users/profile`,
        {
          [type]: selectedSkills, // Send the updated skills
        },
        { withCredentials: true } // Include cookies for authentication
      );

      if (response.data.success) {
        console.log("Updated skills:", selectedSkills);
        toast.success("Skills updated successfully!");
      } else {
        toast.error("Failed to update skills.");
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("An error occurred while updating skills.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">
        Select {type === "skillsToTeach" ? "Teaching" : "Learning"} Skills:
      </h3>
      <div className="grid gap-2 mb-4">
        {techOptions.map((tech) => (
          <label key={tech} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedSkills.includes(tech)}
              onChange={() => handleSkillChange(tech)}
              className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-gray-200">{tech}</span>
          </label>
        ))}
      </div>

      <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
        {loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

// export default SkillsDropdown;
