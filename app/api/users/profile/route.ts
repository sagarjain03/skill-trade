import {connectDB} from "@/dbconfig/dbconfig"
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


connectDB()

export async function GET(request:NextRequest){
  //extract data from token 
  const userId = await getDataFromToken(request)
  const user = await User.findOne({_id: userId}).select("-password -verifyToken -verifyTokenExpiry -__v")

  if(!user){
    return NextResponse.json({error: "User not found"}, {status: 404})
  }
  return NextResponse.json({user, success: true}, {status: 200})
}



export async function PATCH(request: NextRequest) {
  try {
    // Extract user ID from token
    const userId = await getDataFromToken(request);
    console.log(userId, "userId from token");

    // Parse the request body
    const reqBody = await request.json();
    const { username, email, skillsToTeach, skillsToLearn, currentlyLearning } = reqBody;

    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        ...(username && { username }),
        ...(email && { email }),
        ...(skillsToTeach && { skillsToTeach }),
        ...(skillsToLearn && { skillsToLearn }),
        ...(currentlyLearning && { currentlyLearning }),
        
      },
      { new: true, runValidators: true }
    ).select("-password -verifyToken -verifyTokenExpiry -__v");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser, success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}