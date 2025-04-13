import { connectDB } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import CommunityPost from "@/models/communityPostModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text } = await request.json();


    const post = await CommunityPost.findById(params.postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    post.comments.push({
      content: text,
      user: userId
    });

    await post.save();
    return NextResponse.json({ success: true, comments: post.comments });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}