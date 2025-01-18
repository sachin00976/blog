import mongoose from "mongoose";

const subscriberSchema=mongoose.Schema(
    {
        authorId:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        subscriberId:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Subscriber=mongoose.model("Subscriber",subscriberSchema);