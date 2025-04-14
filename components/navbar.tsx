"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Import toast
import axios from "axios";
import {
  Bell,
  Menu,
  X,
  Award,
  BookOpen,
  User,
  Home,
  Users,
  Brain,
  MessageSquare,
  LogOut,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [username, setUsername] = useState("");
  const pathname = useRouter();
  const router  = useRouter();
  const navItems = [
    { href: "/dashboard", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/matches", label: "Matches", icon: <Users className="h-4 w-4 mr-2" /> },
    { href: "/courses", label: "Courses", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { href: "/community", label: "Community", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { href: "/challenges", label: "Challenges", icon: <Brain className="h-4 w-4 mr-2" /> },
    { href: "/interviews", label: "Interviews", icon: <Mic className="h-4 w-4 mr-2" /> },
  ];

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

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout"); // Call the logout API
      toast.success("Logged out successfully!"); // Show success toast
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again."); // Show error toast
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-purple-600 rounded-lg rotate-45 transform origin-center"></div>
                <div className="absolute inset-1 bg-blue-500 rounded-lg rotate-12 transform origin-center"></div>
                <div className="absolute inset-2 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">ST</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                SkillTrade
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center",
                  pathname === item.href && "bg-gray-800 text-white",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                  {notifications}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-purple-500">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
                    <AvatarFallback className="bg-gray-700">UN</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-3 w-3 border-2 border-gray-900"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{username || "Loading..."}</span>
                    <span className="text-xs text-gray-400">Rank B • 2450 XP</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" />
                  <span>Achievements</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>My Courses</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="relative mr-2">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-2">
          <div className="container mx-auto px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 transition-colors",
                  pathname === item.href && "bg-gray-800 text-white",
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}