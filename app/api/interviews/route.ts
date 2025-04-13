import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbconfig/dbconfig";
import Interview from "@/models/interviewModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// GET: Fetch all interviews for the logged-in user
// POST: Create a new interview
export async function GET(request: NextRequest) {
  await connectDB();

  const userId = await getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const interviews = await Interview.find({ userId });
    return NextResponse.json({ success: true, interviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();

  const userId = await getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role, type, techstack, level, questions } = await request.json();

    const interview = await Interview.create({
      userId,
      role,
      type,
      techstack,
      level,
      questions,
    });

    return NextResponse.json({ success: true, interview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 });
  }
}