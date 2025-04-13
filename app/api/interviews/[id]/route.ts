import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// GET: Fetch a specific interview
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const userId = getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params?.id; 
  console.log("id ye rhi sagar",id);
  
  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const interview = await Interview.findById(id);

    if (!interview || interview.userId.toString() !== userId) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, interview });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json({ error: "Failed to fetch interview" }, { status: 500 });
  }
}

// PUT: Update a specific interview
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const userId = await getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params?.id; 
  console.log("id ye rhi sagar",id);
  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const interview = await Interview.findById(id);

    if (!interview || interview.userId.toString() !== userId) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const updates = await request.json();
    Object.assign(interview, updates);
    await interview.save();

    return NextResponse.json({ success: true, interview });
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 });
  }
}

// DELETE: Delete a specific interview
// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/utils/db";
// import { getDataFromToken } from "@/utils/getDataFromToken";
// import Interview from "@/models/interviewModel";

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();

  const userId = await getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = context.params.id;
  console.log("ye hai tera params sagar ",context.params)
  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const interview = await Interview.findById(id);

    if (!interview || interview.userId.toString() !== userId) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    await interview.deleteOne();
    return NextResponse.json({ success: true, message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json({ error: "Failed to delete interview" }, { status: 500 });
  }
}
