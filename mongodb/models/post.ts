import mongoose, { Schema, Document, models, Model } from "mongoose";
import { IUser } from "@/types/user";
import { Comment, IComment, ICommentBase } from "./comment";

export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: IComment[];
    likes?: string[];
}

export interface IPost extends IPostBase, Document {
    createdAt: Date;
    updatedAt: Date;
}

// Define the document methods (for each instance of a post)
interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

// Define the static methods
// this does not belong to a single instance of a post, but to all posts
interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {}  // singular instance of a post
interface IPostModel extends IPostStatics, Model<IPostDocument> {} // all posts

const PostSchema = new Schema<IPostDocument>(
    {
      user: {
        userId: { type: String, required: true },
        userImage: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String },
      },
      text: { type: String, required: true },
      imageUrl: { type: String },
      comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
      likes: { type: [String] },
    },
    {
      timestamps: true,
    }
);

// using a try/catch, call the update the post likes array with the userId
PostSchema.methods.likePost = async function (userId: string) {
    try {
      // updateOne: uses the $addToSet operator to add the userId to the likes array
      await this.updateOne({ $addToSet: { likes: userId } });
    } catch (error) {
      console.log("Attention: Error when liking post", error);
    }
};

PostSchema.methods.unlikePost = async function (userId: string) {
    try {
      await this.updateOne({ $pull: { likes: userId } });
    } catch (error) {
      console.log("Attention: Error when unliking post", error);
    }
};

// remove the post and all its comments

PostSchema.methods.removePost = async function () {
    try {
      // access the Post model and deleting with the id
      await this.model("Post").deleteOne({ _id: this._id });
    } catch (error) {
      console.log("Attention: Error when removing post", error);
    }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
   // create a new comment and add it to the post's comments array
    try {
      const comment = await Comment.create(commentToAdd);
      this.comments.push(comment._id);
      await this.save();
    } catch (error) {
      console.log("Attention: Error when commenting on post", error);
    }
};


PostSchema.statics.getAllPosts = async function () {
    try {
      const posts = await this.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "comments",
  
          options: { sort: { createdAt: -1 } },
        })
        .populate("likes")
        .lean(); // lean() returns a plain JS object instead of a mongoose document
        // for each post, convert the _id to a string and do the same for each comment
      return posts.map((post: IPostDocument) => ({
        ...post,
        _id: post._id.toString(),
        comments: post.comments?.map((comment: IComment) => ({ 
          ...comment,
          _id: comment._id.toString(),
        })),
      }));
    } catch (error) {
      console.log("Attention: Error when getting all posts", error);
    }
};

PostSchema.methods.getAllComments = async function () {
    try {
      await this.populate({
        path: "comments",
  
        options: { sort: { createdAt: -1 } }, // sort comments by newest first
      });
      return this.comments;
    } catch (error) {
      console.log("Attetion: Error when getting all comments", error);
    }
  };

// check if the model is already defined, if not, create it
export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);

