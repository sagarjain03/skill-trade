import { connectDB } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import CommunityPost from "@/models/communityPostModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

// Create a new post
export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get post content and tags from request
    const { content, tags } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Create and save the new post
    const newPost = new CommunityPost({
      content,
      tags: tags || [],
      user: userId,
      likes: 0,
      comments: [],
    });
    await newPost.save();

    // Populate user details in the response
    const populatedPost = await CommunityPost.findById(newPost._id).populate(
      "user",
      "username rank profilePic"
    );

    return NextResponse.json(
      { message: "Post created!", post: populatedPost },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get all posts (with user details)
export async function GET(request: NextRequest) {
  try {
    const posts = await CommunityPost.find({})
      .populate("user", "username rank profilePic") // Include user details
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}