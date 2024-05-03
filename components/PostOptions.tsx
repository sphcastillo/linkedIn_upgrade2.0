'use client'

import { IPostDocument } from "@/mongodb/models/post";
import { useUser, SignedIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import CommentFeed from "./CommentFeed";
import CommentForm from "./CommentForm";
import { toast } from "sonner";

function PostOptions({ 
    postId,
    post
 }:  { 
    postId: string,
    post: IPostDocument 
}) {
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
    const likeOrUnlikePost = async () =>  {
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

        const response = await fetch(
            `/api/posts/${post._id}/${liked ? 'unlike' : 'like'}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );

        if(!response.ok){
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error("Failed to like/unlike post");
        }

        const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);
        if(!fetchLikesResponse.ok){
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error("Failed to fetch likes");
        }

        const newLikedData = await fetchLikesResponse.json();
        setLikes(newLikedData);
    };
    
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
                    onClick={() => {
                        const promise = likeOrUnlikePost();

                        toast.promise(promise, {
                            loading: liked ? "Unliking post..." : "Liking post",
                            success: liked? "Post unliked" : "Post liked",
                            error: liked? "Failed to unlike post" : "Failed to like post"
                        
                        })
                    }}
                >

                    <ThumbsUpIcon 
                        className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
                    />
                    Like
                </Button>

                <Button 
                    variant="ghost" 
                    className="postButton"
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                >
                    <MessageCircle 
                        className={cn('mr-1', isCommentsOpen && 'text-gray-600 fill-gray-600')}
                    />
                    Comment
                </Button>

                <div className="hidden md:flex">  
                    <Button variant="ghost" className="postButton">
                        <Repeat2 className="mr-1"/>
                        Repost
                    </Button>
                </div> 

                <Button variant="ghost" className="postButton">
                    <Send className="mr-1"/>
                    Send
                </Button>
            </div>  

            {isCommentsOpen && (
                <div className="p-4">
                    <SignedIn>
                        <CommentForm postId={postId}/>
                    </SignedIn>
                    <CommentFeed post={post}/>
                </div>
            )}


        </div>
    )
}

export default PostOptions;