import { connectDB } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import CommunityPost from "@/models/communityPostModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {

    const post = await CommunityPost.findById(params.postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    post.likes += 1;
    await post.save();

    return NextResponse.json({ likes: post.likes });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}