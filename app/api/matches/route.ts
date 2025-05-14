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
    // If currentUser already has a stored match, return it.
    if (currentUser.matchedUser) {
      return NextResponse.json({ success: true, match: currentUser.matchedUser }, { status: 200 });
    }
    // Check if someone else already matched with the current user.
    const partner = await User.findOne({ "matchedUser.id": currentUser._id });
    if (partner) {
      currentUser.matchedUser = { id: partner._id, username: partner.username };
      await currentUser.save();
      return NextResponse.json({ success: true, match: currentUser.matchedUser }, { status: 200 });
    }
    // Instead of returning a 400 error when the user isn’t available,
    // return a waiting message.
    if (!currentUser.isFindingMatch) {
      return NextResponse.json({ message: "Waiting for match" }, { status: 200 });
    }
    // Find a matching user based on skills.
    const matchUser = await User.findOne({
      _id: { $ne: currentUser._id },
      isFindingMatch: true,
      skillsToTeach: { $in: [currentUser.currentlyLearning] },
      currentlyLearning: { $in: currentUser.skillsToTeach }
    });
    if (!matchUser) {
      return NextResponse.json({ message: "No match found at the moment" }, { status: 200 });
    }
    // Instead of setting isFindingMatch to false, we do not update it,
    // so both users keep their flag true and can get the mutual match.
    currentUser.matchedUser = { id: matchUser._id, username: matchUser.username };
    matchUser.matchedUser = { id: currentUser._id, username: currentUser.username };
    await currentUser.save();
    await matchUser.save();
    return NextResponse.json({ success: true, match: currentUser.matchedUser }, { status: 200 });
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}