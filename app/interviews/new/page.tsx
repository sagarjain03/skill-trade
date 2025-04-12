"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, PlayCircle, Plus, X } from "lucide-react";
import axios from "@/lib/axios"; // Import Axios instance

export default function NewInterviewPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [type, setType] = useState("Technical");
  const [level, setLevel] = useState("Junior");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/interviews", {
        role,
        type,
        level,
        techstack: techStack,
        additionalInfo,
      });

      if (response.data.success) {
        router.push("/interviews");
      } else {
        console.error("Failed to create interview:", response.data.error);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Brain className="mr-2 h-6 w-6 text-purple-400" />
          Create New Interview
        </h1>
        <p className="text-gray-400 mb-8">Set up your interview parameters</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Interview Details</CardTitle>
                  <CardDescription>Configure your interview session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g. Frontend Developer, UX Designer"
                      className="bg-gray-800 border-gray-700 focus:border-purple-500"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Interview Type</Label>
                    <RadioGroup
                      defaultValue="Technical"
                      value={type}
                      onValueChange={setType}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Technical" id="technical" className="border-purple-500" />
                        <Label htmlFor="technical" className="cursor-pointer">
                          Technical (coding, system design, technical knowledge)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Behavioral" id="behavioral" className="border-purple-500" />
                        <Label htmlFor="behavioral" className="cursor-pointer">
                          Behavioral (soft skills, past experiences, scenarios)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Portfolio" id="portfolio" className="border-purple-500" />
                        <Label htmlFor="portfolio" className="cursor-pointer">
                          Portfolio (project discussions, design decisions)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Experience Level</Label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-purple-500">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                        <SelectItem value="Mid-level">Mid-level (2-5 years)</SelectItem>
                        <SelectItem value="Senior">Senior (5+ years)</SelectItem>
                        <SelectItem value="Lead">Lead/Architect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tech Stack</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add technologies (e.g. React, Node.js)"
                        className="bg-gray-800 border-gray-700 focus:border-purple-500"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTech();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800"
                        onClick={handleAddTech}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {techStack.map((tech) => (
                          <Badge key={tech} className="bg-purple-500/20 text-purple-400 pl-2 pr-1 py-1">
                            {tech}
                            <button
                              type="button"
                              className="ml-1 hover:text-white"
                              onClick={() => handleRemoveTech(tech)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any specific areas you want to focus on or additional context"
                      className="bg-gray-800 border-gray-700 focus:border-purple-500 min-h-24"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isLoading || !role || techStack.length === 0}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                        Creating Interview...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <PlayCircle className="mr-2 h-5 w-5" /> Start Interview
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>

          <div>
            <Card className="bg-gray-900 border-gray-800 sticky top-24">
              <CardHeader>
                <CardTitle>Interview Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Code className="h-4 w-4 mr-2 text-purple-400" /> Technical Interview Tips
                  </h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Be specific about technologies you're familiar with</li>
                    <li>• Prepare to explain your thought process</li>
                    <li>• Review fundamentals of your primary tech stack</li>
                    <li>• Practice coding problems beforehand</li>
                  </ul>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">What to Expect</h3>
                  <p className="text-sm text-gray-400">
                    Our AI will generate relevant questions based on your role, experience level, and tech stack. You'll
                    receive feedback on your answers and suggestions for improvement.
                  </p>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-purple-400">Pro Tips</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• Find a quiet space without distractions</li>
                    <li>• Speak clearly and take your time with responses</li>
                    <li>• It's okay to ask for clarification on questions</li>
                    <li>• Treat this like a real interview for best results</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}