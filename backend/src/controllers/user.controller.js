import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subscriber } from "../models/subscriberSchema.js";
import { ObjectId } from "mongodb";

const genrateAccessTokenAndRefreshToken=async(userid)=>{
    try {
        const user=await User.findById(userid)
        const accessToken= await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();

        user.refreshToken=refreshToken
        user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,"error occur while genrating tokens")
    }
}
const options = {
    httpOnly: true //preveent accessing the cookie from clien site javascript
    // secure: true
  }
const register = asyncHandler(async (req, res) => {
    if(!req.files || Object.keys(req.files).length===0)
    {
        throw new ApiError(404,"User Avatar Requires!")
    }
    const avatar=req.files.avatar || req.files['avatar[]']
    // console.log(req.files)
    const allowedFormat=["image/png","image/jpeg","image/webp"]
    if(!allowedFormat.includes(avatar.mimetype))
    {
        throw new ApiError(404,"Invalid file type. Please provide your avatar in png, jpg or webp format.")
    }
    
      
   

    const { name, email, password, phone, role, education } = req.body;

    console.log(name, email, password, phone, role, education);

    // Validate required fields
    if (!name || !email || !password || !phone || !role || !education) {
        console.log("Validation error: missing fields");
        throw new ApiError(400, "Please fill all details!");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
        throw new ApiError(404, "User with given email already exists");
    }
    const uploadRespone= await uploadOnCloudinary(avatar.tempFilePath)
    if(!uploadRespone)
    {
        throw new ApiError(404,"Avatar File Is Missing!")
    }
    // Create new user
    // console.log(uploadRespone)
    const respon=await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
        avatar:{
            public_id:uploadRespone.public_id,
            url:uploadRespone.secure_url,
        }
    });
   

    // Fetch the created user
    const createduser = await User.findOne({ email });
    if (!createduser) {
        throw new ApiError(500, "Internal DB server error! Please try again");
    }

    // Return successful response
    const {refreshToken,accessToken}=await genrateAccessTokenAndRefreshToken(createduser._id)

    return res.status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(201, createduser, "User registered successfully")
    );
});
const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
  
    // Log input for debugging (remove this in production)
    console.log(`Email: ${email}, Password: ${password}, Role: ${role}`);
  
    // Validate input fields
    if (!email || !password || !role) {
      throw new ApiError(404, "Please enter all fields to login");
    }
  
    // Find user by email and exclude sensitive fields
    const user = await User.findOne({ email }).select("-createdAt -updatedAt");
    if (!user) {
      throw new ApiError(400, "Invalid credentials! Please enter correct email.");
    }
  
    // Validate userId
    const userId = user._id;
    if (!ObjectId.isValid(userId)) {
      throw new ApiError(404, "Invalid userId");
    }
  
    // Fetch subscriber count for the user
    const response = await Subscriber.aggregate([
      { $match: { authorId: new ObjectId(userId) } },
      { $count: "SubscriberCount" },
    ]);
  
    if (!response) {
      throw new ApiError(500, "Something went wrong while fetching subscriber count");
    }
  
    // Extract subscriber count or default to 0
    const subscriberCount = response.length === 0 ? "0" : response[0]?.SubscriberCount || "0";
    console.log(`Subscriber Count: ${subscriberCount}`);
  
    // Prepare user object with subscription count
    const userWithSubscriptionCount = { subscriberCount, ...user._doc };
  
    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid password. Please try again.");
    }
  
    // Validate role
    if (user.role !== role) {
      throw new ApiError(404, "Invalid role. Please enter the correct role!");
    }
  
    // Generate access and refresh tokens
    const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(user._id);
  
    // Set cookies and respond with success
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(201, userWithSubscriptionCount, "User logged in successfully"));
  });
  
const logout=asyncHandler(async (req,res)=>{
    const user=req.user

    user.refreshToken=null
    await user.save({validateBeforeSave:false})

    return res.status(201)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(201,{},"User logged out Successfully!")
    )
})
const getMyProfile=asyncHandler(async(req,res)=>{
    let user=req.user;
    const userId=user._id
    if(!ObjectId.isValid(userId))
    {
        throw new ApiError(404,"Inavalid userId")
    }
    const response=await Subscriber.aggregate(
        [
            {
              $match: {
                
             authorId: new ObjectId(userId)
              }
          },
            {
              $count: 'SubscriberCount'
            }
          ]
    )
    if(!response)
    {
        throw new ApiError(500,"Something went wrong while fetching subscriber")
    }
    const subscriberCount=(response.length===0?"0":response[0]?.SubscriberCount)
    console.log(subscriberCount)
    const userWithSubscriptionCount={subscriberCount:subscriberCount,...req.user._doc}
    // console.log(user.subscriberCount,)
    
    //const subscriberCount=subscriberCount;
    // console.log()
    
    return res.status(200).json(
    new ApiResponse(200,userWithSubscriptionCount,"Successfully fetched user data")
    )
})
const getAllAuthors=asyncHandler(async (req,res)=>{
    const authors=await User.find({role:"Author"})

    return res.status(200).json(
        new ApiResponse(200,authors,"All authors fetched successfully")
    )
})
const getAllUserBlog=asyncHandler(async(req,res)=>{
    const user=req.user
   
    const allBlogs=await User.aggregate(
        [
            {
              $match: {
                email: `${user.email}` // Closing brace added here
              }
            },
            {
              $lookup: {
                from: "blogs",
                localField: "_id",
                foreignField: "createdBy",
                as: "blogs"
              }
            },
            {
              $project: {
                blogs: {
                  $map: {
                    input: "$blogs",
                    as: "blog",
                    in: {
                      _id: "$$blog._id",
                      mainImage: "$$blog.mainImage",
                      category: "$$blog.category",
                      title: "$$blog.title",
                      authorAvatar: "$$blog.authorAvatar",
                      authorName: "$$blog.authorName"
                    }
                  }
                }
              }
            }
          ]
          
    )
    return res.status(200).json(
        new ApiResponse(200,allBlogs,"All users blogs fetched successfully")
    )
})
export {
    register,
    login,
    logout,
    getMyProfile,
    getAllAuthors,
    getAllUserBlog,


};
