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