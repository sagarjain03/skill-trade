"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Play,
  Download,
  Copy,
  Save,
  Share,
  Cpu,
  Braces,
  Code,
  Terminal,
  Maximize,
  Minimize,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { toast } from "sonner"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-900 border border-gray-800 rounded-md flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-blue-500 animate-spin mb-4"></div>
        <p className="text-blue-400 animate-pulse">Loading Editor...</p>
      </div>
    </div>
  ),
})

// Language options with their Monaco identifiers and sample code
const languages = [
  {
    id: "javascript",
    name: "JavaScript",
    monacoId: "javascript",
    sampleCode: `// JavaScript Code Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the first 10 Fibonacci numbers
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log("Fibonacci Sequence:", results);
`,
  },
  {
    id: "python",
    name: "Python",
    monacoId: "python",
    sampleCode: `# Python Code Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate the first 10 Fibonacci numbers
results = []
for i in range(10):
    results.append(fibonacci(i))

print("Fibonacci Sequence:", results)
`,
  },
  {
    id: "java",
    name: "Java",
    monacoId: "java",
    sampleCode: `// Java Code Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Fibonacci Sequence:");
        for (int i = 0; i < 10; i++) {
            System.out.print(fibonacci(i) + " ");
        }
    }

    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}
`,
  },
  {
    id: "cpp",
    name: "C++",
    monacoId: "cpp",
    sampleCode: `// C++ Code Example
#include <iostream>
#include <vector>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    std::vector<int> results;
    for (int i = 0; i < 10; i++) {
        results.push_back(fibonacci(i));
    }

    std::cout << "Fibonacci Sequence: ";
    for (int num : results) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
`,
  },
  {
    id: "csharp",
    name: "C#",
    monacoId: "csharp",
    sampleCode: `// C# Code Example
using System;
using System.Collections.Generic;

class Program {
    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }

    static void Main() {
        List<int> results = new List<int>();
        for (int i = 0; i < 10; i++) {
            results.Add(Fibonacci(i));
        }

        Console.WriteLine("Fibonacci Sequence: " + string.Join(", ", results));
    }
}
`,
  },
  {
    id: "rust",
    name: "Rust",
    monacoId: "rust",
    sampleCode: `// Rust Code Example
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    let mut results = Vec::new();
    for i in 0..10 {
        results.push(fibonacci(i));
    }

    println!("Fibonacci Sequence: {:?}", results);
}
`,
  },
]

export default function PlaygroundPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [code, setCode] = useState(languages[0].sampleCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [theme, setTheme] = useState("vs-dark")
  const [fontSize, setFontSize] = useState(14)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle language change
  const handleLanguageChange = (languageId: string) => {
    const language = languages.find((lang) => lang.id === languageId)
    if (language) {
      setSelectedLanguage(language)
      setCode(language.sampleCode)
    }
  }

  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  // Updated runCode function
  const runCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      const response = await fetch("/api/playground/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage.id,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setOutput(data.output)
      } else {
        setOutput(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error executing code:", error)
      setOutput("An error occurred while executing the code.")
    } finally {
      setIsRunning(false)
    }
  }

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard")
  }

  // Download code
  const downloadCode = () => {
    const fileExtensions: Record<string, string> = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      rust: "rs",
    }

    const extension = fileExtensions[selectedLanguage.id] || "txt"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Code downloaded as code.${extension}`)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Show particles after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Animated background elements */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/10 animate-pulse"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4 md:mb-0">
            Quantum Code Playground
          </h1>
          <div className="flex items-center space-x-2">
            <Select value={selectedLanguage.id} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 focus:ring-blue-500">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {languages.map((language) => (
                  <SelectItem key={language.id} value={language.id}>
                    <div className="flex items-center">
                      <Braces className="h-4 w-4 mr-2 text-blue-400" />
                      {language.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 bg-gray-900 hover:bg-gray-800 hover:text-blue-400"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div
          ref={containerRef}
          className={cn(
            "rounded-lg overflow-hidden border border-gray-800 transition-all duration-300",
            isFullscreen ? "bg-gray-950" : "bg-gray-900",
          )}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 border-r border-gray-800">
              <MonacoEditor
                height="600px"
                language={selectedLanguage.monacoId}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: fontSize,
                  fontFamily: "JetBrains Mono, monospace",
                  cursorBlinking: "phase",
                  cursorSmoothCaretAnimation: "on",
                  smoothScrolling: true,
                  padding: { top: 16 },
                  glyphMargin: true,
                }}
              />
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="output" className="w-full">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                  <TabsList className="bg-gray-800 border border-gray-700">
                    <TabsTrigger
                      value="output"
                      className="data-[state=active]:bg-blue-950 data-[state=active]:text-blue-400"
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      Output
                    </TabsTrigger>
                    <TabsTrigger
                      value="console"
                      className="data-[state=active]:bg-blue-950 data-[state=active]:text-blue-400"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Console
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> Run Code
                      </>
                    )}
                  </Button>
                </div>
                <TabsContent value="output" className="p-0 m-0">
                  <div className="h-[568px] bg-gray-950 p-4 font-mono text-sm overflow-auto">
                    {output ? (
                      <pre className="text-green-400">{output}</pre>
                    ) : (
                      <div className="text-gray-500 h-full flex flex-col items-center justify-center">
                        <Terminal className="h-12 w-12 mb-4 opacity-20" />
                        <p>Run your code to see the output here</p>
                        <p className="text-xs mt-2">Press the Run Code button to execute</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="console" className="p-0 m-0">
                  <div className="h-[568px] bg-gray-950 p-4 font-mono text-sm overflow-auto">
                    <div className="text-gray-500 h-full flex flex-col items-center justify-center">
                      <Code className="h-12 w-12 mb-4 opacity-20" />
                      <p>Console logs will appear here</p>
                      <p className="text-xs mt-2">Use console.log() in your code to see output</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
