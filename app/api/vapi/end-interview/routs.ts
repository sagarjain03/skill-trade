import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { callId } = body

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

    // End the Vapi call
    const response = await fetch(`https://api.vapi.ai/call/${callId}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${vapiApiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Vapi API error:", errorData)
      return NextResponse.json({ success: false, error: "Failed to end Vapi call" }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      message: "Call ended successfully",
    })
  } catch (error) {
    console.error("Error ending Vapi call:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
