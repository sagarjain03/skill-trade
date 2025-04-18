import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id

    // Connect to MongoDB
    const { db } = await connectToDatabase()
    const interviews = db.collection("interviews")

    // Convert string ID to ObjectId
    const objectId = new ObjectId(interviewId)

    // Update the interview document to mark it as finalized
    const updateResult = await interviews.updateOne(
      { _id: objectId },
      {
        $set: {
          finalized: true,
          completedAt: new Date(),
        },
      },
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Interview not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Interview finalized successfully",
    })
  } catch (error) {
    console.error("Error finalizing interview:", error)
    return NextResponse.json({ success: false, error: "Failed to finalize interview" }, { status: 500 })
  }
}
