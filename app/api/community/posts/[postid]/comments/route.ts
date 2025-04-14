import { connectDB } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import CommunityPost from "@/models/communityPostModel";
import { create } from "domain";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest, { params }: { params: { postid: string } }) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text } = await request.json();
    console.log("Text:", text);
    if (!text?.trim()) return NextResponse.json({ error: "Comment content required" }, { status: 400 });


    const post = await CommunityPost.findById(params.postid);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    post.comments.push({
      content: text,
      user: userId,
      createdAt: new Date(),
    });

    await post.save();

    const updatedPost = await CommunityPost.findById(post._id)
    .populate("comments.user", "username profilePic rank");

    return NextResponse.json({ success: true, comments: updatedPost.comments });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}