import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { callId: string } }) {
  try {
    const callId = params.callId

    if (!callId) {
      return NextResponse.json({ success: false, error: "Call ID is required" }, { status: 400 })
    }

    // Get Vapi API key from environment variables
    const vapiApiKey = process.env.VAPI_API_KEY
    if (!vapiApiKey) {
      return NextResponse.json(
        { success: false, error: "VAPI_API_KEY environment variable is not set" },
        { status: 500 },
      )
    }

    // Get call details and transcription
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${vapiApiKey}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Vapi API error:", data)
      return NextResponse.json(
        { success: false, error: "Failed to get call transcription" },
        { status: response.status },
      )
    }

    // Extract user's responses from the transcript
    let transcription = ""
    let status = "in_progress"

    if (data.transcript && data.transcript.length > 0) {
      // Filter for user messages only
      const userMessages = data.transcript.filter((item: any) => item.role === "user" || item.role === "human")

      // Combine all user messages
      transcription = userMessages.map((item: any) => item.text).join(" ")
    }

    // Check if call is completed
    if (data.status === "completed" || data.status === "ended") {
      status = "completed"
    }

    return NextResponse.json({
      success: true,
      transcription,
      status,
    })
  } catch (error) {
    console.error("Error getting call transcription:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
