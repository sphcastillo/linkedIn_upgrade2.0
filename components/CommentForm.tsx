'use client'

import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import createCommentAction from "@/actions/createCommentAction";

function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (formData: FormData) : Promise<void> => {
    const formDataCopy = formData;
    // reset the form
    ref.current?.reset();

    try {
      // server action
      if(!user?.id){
        throw new Error("User not authenticated");
      }

      await createCommentActionWithPostId(formDataCopy);

    } catch(error){
      console.error(`Error creating comment: ${error}`);
    }
  }

  return (
    <form
      ref={ref}
      action={(FormData) => {
        const promise = handleCommentAction(FormData);

        // Toast
      }}
      className="flex items-center space-x-1"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl}/>
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 bg-white border rounded-full px-3  py-2">
        <input 
          type="text" 
          placeholder="Add a comment..."
          className="flex-1 bg-transparent outline-none text-sm"
          name="commentInput"
        />
        <button type="submit" hidden>Post</button>
      </div>
    </form>
  )
}

export default CommentForm;