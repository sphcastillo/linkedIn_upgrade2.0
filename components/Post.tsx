'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { IPostDocument } from "@/mongodb/models/post"
import { useUser } from "@clerk/nextjs"
import ReactTimeAgo from "react-timeago"
import deletePostAction from "@/actions/deletePostAction"
import Image from "next/image"
import PostOptions from "./PostOptions"


function Post({ post } : { post: IPostDocument }) {
    const { user } = useUser();

    const isAuthor = user?.id  === post.user.userId;
    
    return (
        <div className="bg-white rounded-md border">
            <div className='p-4 flex space-x-2'>
                <div>
                    <Avatar>
                        <AvatarImage src={post.user.userImage} />
                        <AvatarFallback>
                            {post.user.firstName?.charAt(0)}
                            {post.user.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex justify-between flex-1">
                    <div>
                        <p className="font-semibold">
                            {post.user.firstName} {post.user.lastName}{" "}
                            {isAuthor && (
                                <Badge className="ml-2" variant="secondary">
                                Author
                                </Badge> 
                            )}
                        </p>

                        <p className="text-xs text-gray-400">
                            @{post.user.firstName}
                            {post.user.firstName}-{post.user.userId.toString().slice(-4)}
                        </p>

                        <p className="text-xs text-gray-400">
                            <ReactTimeAgo date={new Date(post.createdAt)}/>
                        </p>
                    </div>
                
                    {isAuthor && (
                    <Button 
                        variant="outline"
                        onClick={() => {
                            // Handle delete post action
                            const promise = deletePostAction(post._id);

                            // Toast notification based on the promise above
                        }}
                    >
                        <Trash2 />
                    </Button>
                    )}

                </div>
            </div>

            <div>
                <p className="px-4  pb-2 mt-2">{post.text}</p>

                {/** If image uploaded - put it here ...  */}
            
                {post.imageUrl && (
                    <Image 
                        className="w-full mx-auto"
                        height={500}
                        width={500}
                        alt="Post Image"
                        src={post.imageUrl}
                    />
                )}
            </div>
            {/** PostOptions */}
            <PostOptions post={post} />
        </div>
    )
}

export default Post;