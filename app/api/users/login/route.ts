import {connectDB} from "@/dbconfig/dbconfig"
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {DecodedToken} from "@/types/decodedToken"
connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody

        //check if user exists
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error: "Invalid credentials"}, {status: 400})
        }

        //check if password is correct
        const isMatch = await bcryptjs.compare(password, user.password)

        if(!isMatch){
            return NextResponse.json({error: "Invalid credentials"}, {status: 400})
        }

        const tokendata : DecodedToken= {
          id:user._id,
          username:user.username,
          email:user.email,
        }

      
    const token = jwt.sign(tokendata, process.env.JWT_SECRET!, { expiresIn: "1d" });



       const response =  NextResponse.json({
            message: "Login successful",
            success: true,
            user
        })

        response.cookies.set("token", token, {httpOnly: true})

        return response
        


    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})

    }
}