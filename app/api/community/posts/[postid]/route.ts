import { connectDB } from "@/dbconfig/dbconfig";
import CommunityPost from "@/models/communityPostModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

// Get single post
export async function GET(request: NextRequest, { params }: { params: { postid: string } }) {
    try {
        // console.log("Fetched post:", params);
        const post = await CommunityPost.findById(params.postid)
            .populate("user", "username rank")
            // .populate("comments.user", "username profilePic");

        if (!post) {
            console.error("Post not found for ID:", params.postid);
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }


        return NextResponse.json({ post });
    } catch (error: any) {
        console.error("GET Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}