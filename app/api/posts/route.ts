import connectDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
    user: IUser;
    text: string;
    imageUrl?: string | null;
  }
  
// Protected endpoint
export async function POST(request: Request) {
    // protect the route with Clerk's auth middleware
    // auth().protect();
    const { user, text, imageUrl }: AddPostRequestBody = await request.json();

    try {
        await connectDB();

        // if there is an image, upload it to Azure Blob Storage
        const postData: IPostBase = {
            user,
            text,
            ...(imageUrl && { imageUrl }),
        };

        // create and add a new post in the database
        const post =  await Post.create(postData);
        return NextResponse.json({ message: "SUCCESS: Post created successfully!" ,post });
    } catch (error){
        return NextResponse.json(
            { error: `ATTENTION: Error occurred while creating post: ${error} `},
            {
                status: 500,
            }
        )
    }
}

// Public endpoint
export async function GET(request: Request) {
    try {
        await connectDB();

        const posts = await Post.getAllPosts();
        // return all the posts from the database
        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json(
            { error: "ATTENTION: Error occurred while fetching posts"},
            {
                status: 500,
            }
        )
    }
}
