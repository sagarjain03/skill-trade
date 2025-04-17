import { connectDB } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import CommunityPost from "@/models/communityPostModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postid: string; commentid: string } }
) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postid, commentid } = params;
    
    // Find the post
    const post = await CommunityPost.findById(postid);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    
    // Find the comment
    const commentIndex = post.comments.findIndex(
      (comment: any) => comment._id.toString() === commentid && comment.user.toString() === userId
    );
    
    // Check if comment exists and belongs to the user
    if (commentIndex === -1) {
      return NextResponse.json({ 
        error: "Comment not found or you don't have permission to delete it" 
      }, { status: 403 });
    }
    
    // Remove the comment
    post.comments.splice(commentIndex, 1);
    await post.save();
    
    return NextResponse.json({ 
      success: true, 
      message: "Comment deleted successfully" 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}