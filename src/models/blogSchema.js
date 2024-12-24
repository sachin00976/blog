import mongoose from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const blogSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    mainImage:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    intro:{
        type:String,
        required:true,
        minLength:[250,"Blog intro must contain atleast 250 character!"],
    },
    paraOneImage:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        }
    },
    paraOneDescription: {
        type: String,
      },
      paraOneTitle: {
        type: String,
      },
      paraTwoImage: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      paraTwoDescription: {
        type: String,
      },
      paraTwoTitle: {
        type: String,
      },
      paraThreeImage: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      paraThreeDescription: {
        type: String,
      },
      paraThreeTitle: {
        type: String,
      },
      category: {
        type: String,
        required: true,
      },
      createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      authorName: {
        type: String,
        required: true,
      },
      authorAvatar: {
        type: String,
        required: true,
      },
      published: {
        type: Boolean,
        default: false,
      },
      published:{
        type:Boolean,
        default:false,
      }

},{timestamps:true})
blogSchema.plugin(aggregatePaginate)
export const Blog=mongoose.model("Blog",blogSchema)