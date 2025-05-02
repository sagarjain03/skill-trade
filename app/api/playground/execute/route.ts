import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    // Map your language to Judge0 language IDs
    const languageMap: Record<string, number> = {
      javascript: 63, // Node.js
      python: 71, // Python 3
      java: 62, // Java
      cpp: 54, // C++
      csharp: 51, // C#
      rust: 73, // Rust
    };

    const languageId = languageMap[language];
    if (!languageId) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    // Send the code to Judge0 API
    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "f7572b4851mshfc7a0afbcd3c384p1f4b9bjsn4fa07c8fc788", 
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return NextResponse.json({ output: data.stdout || data.stderr }, { status: 200 });
    } else {
      return NextResponse.json({ error: data.message || "Failed to execute code" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error executing code:", error);
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 });
  }
}