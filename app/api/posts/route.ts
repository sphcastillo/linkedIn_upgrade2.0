import connectDB from "@/mongodb/db";
import { IPostBase } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
    user: IUser;
    text: string;
    imageUrl?: string | null;
  }
  

export async function POST(request: Request) {
    auth().protect();

    const  { user, text, imageUrl }:  AddPostRequestBody = await request.json();

    const postData: IPostBase = {
        user,
        text,
        
    
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
    } catch (error) {
        return NextResponse.json(
            { error: "Attention: Error occurred while fetching posts"},
            {
                status: 500,
            }
        )
    }
}
