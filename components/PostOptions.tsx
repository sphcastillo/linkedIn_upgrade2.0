'use client'

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";

function PostOptions({ post }:  { post: IPostDocument }) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const { user } = useUser();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);

    useEffect(() => {
        // Check if user has liked the post
        if(user?.id && post.likes?.includes(user.id)){
            setLiked(true);
        }
    }, [post, user]);

    // prime example of where we do an API call -> to our Like endpoint
    const likeOrUnlikePost = async() =>  {
        if(!user?.id){
            throw new Error("User not authenticated");
        }

        const originalLikes = likes;
        const originalLiked = liked;

        // if I already liked the post, I want to unlike it
        const newLikes = liked 
        ? likes?.filter((like) => like !== user.id)
        // spread the likes and add the user id to the array
        : [...(likes ?? []), user.id];

        const body: LikePostRequestBody | UnlikePostRequestBody = {
            userId: user.id
        };

        setLiked(!liked);
        setLikes(newLikes);

        // const response = await fetch()
    }
    
    return (
        <div>
            <div className="flex justify-between p-4">
                <div>
                    {likes && likes.length > 0 && (
                        <p className="text-xs text-gray-500 cursor-pointer hover:underline">
                            {likes.length} likes
                        </p>
                    )}
                </div>

                <div>
                    {post?.comments && post.comments.length > 0 &&  (
                        <p 
                            className="text-xs text-gray-500 cursor-pointer hover:underline"
                            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        >
                            {post.comments.length} comments
                        </p>
                    )}
                </div>
            </div>

            <div className="flex p-2 justify-between px-2 border-t">
                <Button
                    variant="ghost"
                    className="postButton"
                    onClick={likeOrUnlikePost}
                >
                    <ThumbsUpIcon 
                        
                    />
                    Like
                </Button>

                <Button variant="ghost" className="postButton">
                    <MessageCircle 
                        className={cn('mr-1', isCommentsOpen && 'text-gray-600 fill-gray-600')}
                    />
                    Comment
                </Button>

                <Button variant="ghost" className="postButton">
                    <Repeat2 className="mr-1"/>
                    Repost
                </Button>

                <Button variant="ghost" className="postButton">
                    <Send className="mr-1"/>
                    Send
                </Button>
            </div>  

            {isCommentsOpen && (
                <div className="p-4">

                </div>
            )}
        </div>
    )
}

export default PostOptions;