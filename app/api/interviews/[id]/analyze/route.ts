import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id
    const body = await request.json()
    const { questionIndex, answer, question } = body

    if (!answer || answer.trim() === "") {
      return NextResponse.json({ success: false, error: "Answer is required" }, { status: 400 })
    }

    // Analyze the answer using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer. Analyze the candidate's answer to the interview question and provide feedback. 
          Score the answer on a scale of 0-100 based on accuracy, completeness, and clarity.
          Provide constructive feedback and 2-3 specific suggestions for improvement.
          Format your response as JSON with the following fields:
          - score: number between 0-100
          - feedback: detailed feedback on the answer
          - suggestions: array of 2-3 specific suggestions for improvement`,
        },
        {
          role: "user",
          content: `Question: ${question}\n\nCandidate's Answer: ${answer}`,
        },
      ],
      response_format: { type: "json_object" },
    })

    // Parse the response
    const result = JSON.parse(response.choices[0].message.content || "{}")

    return NextResponse.json({
      success: true,
      score: result.score || 0,
      feedback: result.feedback || "No feedback available",
      suggestions: result.suggestions || [],
    })
  } catch (error) {
    console.error("Error analyzing interview answer:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze answer" }, { status: 500 })
  }
}
