import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id
    const body = await request.json()
    const { questionIndex, answer, feedback } = body

    // Connect to MongoDB
    const { db } = await connectToDatabase()
    const interviews = db.collection("interviews")

    // Convert string ID to ObjectId
    const objectId = new ObjectId(interviewId)

    // Update the interview document
    const updateResult = await interviews.updateOne(
      { _id: objectId },
      {
        $set: {
          [`answers.${questionIndex}`]: answer,
          [`feedback.${questionIndex}`]: feedback,
        },
      },
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Interview not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Answer saved successfully",
    })
  } catch (error) {
    console.error("Error saving interview answer:", error)
    return NextResponse.json({ success: false, error: "Failed to save answer" }, { status: 500 })
  }
}
