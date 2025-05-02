import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbconfig/dbconfig"; // Updated to use connectDB, the correct named export
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    // Extract user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure current user is active in finding a match
    if (!currentUser.isFindingMatch) {
      return NextResponse.json({ error: "User is not available for matching" }, { status: 400 });
    }

    // Find a matching user:
    // Condition: The other user must be active for matching,
    // have a skillsToTeach array that includes the current user's currentlyLearning,
    // and its currentlyLearning value is in the current user's skillsToTeach.
    const matchUser = await User.findOne({
      _id: { $ne: currentUser._id },
      isFindingMatch: true,
      skillsToTeach: { $in: [currentUser.currentlyLearning] },
      currentlyLearning: { $in: currentUser.skillsToTeach }
    });
    
    if (!matchUser) {
      return NextResponse.json({ message: "No match found at the moment" }, { status: 200 });
    }

    // Mark both users as no longer available for matching
    currentUser.isFindingMatch = false;
    matchUser.isFindingMatch = false;
    await currentUser.save();
    await matchUser.save();

    return NextResponse.json({ success: true, match: matchUser }, { status: 200 });
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}