"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASToken";

import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url = undefined;

  if (!postInput) {
    throw new Error("Post input is required");
  }

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  try {
    if (image.size > 0) {
      // 1. If exists, upload the image to MS Blob Storage
      // console.log("Uploading image to Azure Blob Storage...", image);

      const accountName = process.env.AZURE_STORAGE_NAME;

      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // generate current timestamp
      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;
      // push this to add data to bucket
      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      // upload the image to Azure Blob Storage
      const res = await blockBlobClient.uploadData(imageBuffer);
      // return url of the image
      image_url = res._response.request.url;

      // console.log("File uploaded successfully!: ", image_url);
      // 2. Create a new post with the image URL
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };

      await Post.create(body);
    } else {
      // 1. Create a new post without an image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
    }
  } catch (error: any) {
    // console.error("Error occurred while creating post: ", error.message);
  }

  // once uploaded, the post will be created and the cache will be revalidated
  revalidatePath("/");
}