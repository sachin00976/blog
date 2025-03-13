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

export  {
    createSubscriber,
    deleteSubscriber,
    
}