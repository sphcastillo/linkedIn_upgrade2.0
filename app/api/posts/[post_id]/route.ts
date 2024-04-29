import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
        request: Request,
        { params }: { params: { post_id: string } }
    ) {
        await connectDB();

        try {
            const post = await Post.findById(params.post_id);

            if(!post){
                return NextResponse.json({ error: "ATTENTION: Post not found!" }, { status: 404 });
            }

            return NextResponse.json({ post });
        } catch (error){
            return NextResponse.json(
                { error: "An error occurred while fetching the post"},
                { status: 500 }
            );
        }
}

export interface DeletePostRequestBody {
    userId: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: { post_id: string } }
) {
    auth().protect();

    //  Correct way to get the current user
    // const user = await currentUser();

    await connectDB();

    const { userId }: DeletePostRequestBody = await request.json();

    try {
        const post = await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({ error: "ATTENTION: Post not found!" }, { status: 404 });
        }

        if(post.user.userId !== userId){
            return NextResponse.json({ error: "ATTENTION: Post does not belong to the user!" }, { status: 403 });
        }

        // Correct way to get the current user
        // if(post.user.userId !== user?.id){
        //     throw new Error("Post does not belong to ther user!");
        // }
    } catch (error){
        return NextResponse.json(
            { error: "An error occurred while fetching the post"},
            { status: 500 }
        )
    }
}