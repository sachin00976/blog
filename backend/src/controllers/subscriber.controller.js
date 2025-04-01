import { Subscriber} from "../models/subscriberSchema.js";
import {asyncHandler} from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import  {ApiResponse} from "../utils/ApiResponse.js"
import { ObjectId } from "mongodb";




const createSubscriber=asyncHandler(async (req,res)=>{

    const subscriberId=req.user.id
    const {id}=req.params

    const response=await Subscriber.create({
        authorId:id,
        subscriberId:subscriberId
    })

    if(response)
    {
        return res.status(200).json(
            new ApiResponse(200,response,"new subscriber created successfully")
        )
    }
    else
    {
        throw new ApiError(500,"Something went wrong while creating subscriber")
    }
})
const deleteSubscriber = asyncHandler(async (req, res) => {
    const subscriberId = req.user.id; // ID of the logged-in user
    const { id } = req.params; // ID of the author
    
    
    if (!ObjectId.isValid(subscriberId) || !ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid subscriberId or authorId");
    }
  
    const filter = {
        subscriberId: ObjectId.createFromHexString(subscriberId),
        authorId: ObjectId.createFromHexString(id)
    };

    
    const response = await Subscriber.deleteOne(filter);

    if (response.deletedCount > 0) {
        return res.status(200).json(
            new ApiResponse(200, response, "Subscriber deleted successfully")
        );
    } else {
        throw new ApiError(404, "Subscriber not found or already deleted");
    }
});
const getAllUserSubscriberInfo = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let { page = 0, limit = 9 } = req.query;

  page = Number(page) || 0;
  limit = Number(limit) || 9;
  let skip = (page > 0 ? (page - 1) * limit : 0);

  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User Id");
  }
  // console.log("page:",page)

  const totalCountResponse = await Subscriber.aggregate([
    {
      $match: { 
        subscriberId: new ObjectId(userId)
      }
    },
    {
      $count: "totalDataCount"
    }
  ]);

  if (!totalCountResponse || totalCountResponse.length === 0) {
    throw new ApiError(500, "Error occurred while fetching total subscriber count.");
  }

  const allAuthoInfoResponse = await Subscriber.aggregate([
    {
      "$match": {
        "subscriberId": new ObjectId(userId)
      }
    },
    {
      "$lookup": {
        "from": "users",
        "localField": "authorId",
        "foreignField": "_id",
        "as": "authorInfo"
      }
    },
    {
      "$addFields": {
        "authorInfo": { "$arrayElemAt": ["$authorInfo", 0] }
      }
    },
    {
      "$addFields": {
        "name": "$authorInfo.name",
        "email": "$authorInfo.email",
        "avatar": "$authorInfo.avatar"
      }
    },
    {
      "$lookup": {
        "from": "subscribers",
        "localField": "authorId",
        "foreignField": "authorId",
        "as": "subscriberCount"
      }
    },
    {
      "$addFields": {
        "subscriberCount": { $size: "$subscriberCount" }
      }
    },
    {
      "$project": {
        "_id": 1,
        "authorId": 1,
        "name": 1,
        "email": 1,
        "avatar": 1,
        "subscriberCount": 1
      }
    },
    { 
      $skip: skip 
    },
    { 
      $limit: limit 
    }
  ]);

  if (!allAuthoInfoResponse || allAuthoInfoResponse.length === 0) {
    throw new ApiError(500, "Error occurred while fetching user's subscribed author info");
  }

  const response = {
    total: totalCountResponse[0]?.totalDataCount || 0,
    allAuthorInfo: allAuthoInfoResponse
  };

  return res.status(200).json(
    new ApiResponse(200, response, "All user's subscribed author info fetched successfully")
  );
});


export  {
    createSubscriber,
    deleteSubscriber,
    getAllUserSubscriberInfo
    
}