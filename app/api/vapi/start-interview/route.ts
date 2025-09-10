import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, role, type, level } = body

    if (!question) {
      return NextResponse.json({ success: false, error: "Question is required" }, { status: 400 })
    }

    // Get Vapi API key from environment variables
    const vapiApiKey = process.env.VAPI_API_KEY
    if (!vapiApiKey) {
      return NextResponse.json(
        { success: false, error: "VAPI_API_KEY environment variable is not set" },
        { status: 500 },
      )
    }

    // Create a new Vapi call
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${vapiApiKey}`,
      },
      body: JSON.stringify({
        assistant_id: process.env.VAPI_ASSISTANT_ID || "interviewer", 
        recipient: {
          user_id: "user_" + Date.now(), 
        },
        metadata: {
          question,
          role,
          type,
          level,
        },
        // Configure the assistant to act as an interviewer
        config: {
          first_message: `I'll be conducting your ${type} interview for the ${role} position at ${level} level. Here's your question: ${question}`,
          wait_for_greeting: false,
          end_call_after_silence: 3000, 
          record_call: true,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Vapi API error:", data)
      return NextResponse.json({ success: false, error: "Failed to create Vapi call" }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      callId: data.call_id,
      audioUrl: data.audio_url,
    })
  } catch (error) {
    console.error("Error starting Vapi interview:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
