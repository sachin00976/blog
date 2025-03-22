import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        authorId: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        comment: {
            type: String,
            required: true,
            minlength: [1, "Invalid || empty comment"],
        },
        blogId:{
            type:mongoose.Schema.ObjectId,
            ref:"Blog",
            required:true
        }
    },
    {
        timestamps: true
    }
);

export const Comment = mongoose.model("Comment", commentSchema);
