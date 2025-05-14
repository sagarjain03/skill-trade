import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbconfig/dbconfig";
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
    const matchUser = await User.findOne({
      _id: { $ne: currentUser._id },
      isFindingMatch: true,
      skillsToTeach: { $in: [currentUser.currentlyLearning] },
      currentlyLearning: { $in: currentUser.skillsToTeach }
    });
    
    if (!matchUser) {
      return NextResponse.json({ message: "No match found at the moment" }, { status: 200 });
    }

    // Set both users as matched and store mutual match details
    currentUser.isFindingMatch = false;
    matchUser.isFindingMatch = false;

    // Save a simple matchedUser field (you may want to adjust your schema accordingly)
    currentUser.matchedUser = { id: matchUser._id, username: matchUser.username };
    matchUser.matchedUser = { id: currentUser._id, username: currentUser.username };

    await currentUser.save();
    await matchUser.save();

    // Return the matched user information (for the caller, you can return either side)
    return NextResponse.json({ success: true, match: currentUser.matchedUser }, { status: 200 });
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}