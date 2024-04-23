'use server'

import { currentUser } from "@clerk/nextjs/server"

export default async function createPostAction(formData: FormData){
    const user = await currentUser();
    if(!user){
        throw new Error("Attention: User not authenticated");
    }

    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let imageUrl: string | undefined;

    if(!postInput){
        throw new Error("Attention: Post input is required!");
    }

    // define user

    // upload image

    // create post

    //
}
