import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subscriber } from "../models/subscriberSchema.js";
import { ObjectId } from "mongodb";
import { jwtDecode } from "jwt-decode";

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
    httpOnly: true ,//preveent accessing the cookie from clien site javascript
    secure: true
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

    //console.log(name, email, password, phone, role, education);

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
    //console.log(`Email: ${email}, Password: ${password}, Role: ${role}`);
  
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
    //console.log(`Subscriber Count: ${subscriberCount}`);
  
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
const getAllAuthors = asyncHandler(async (req, res) => {
  let { page = 0, limit = 9 } = req.query;

  page = Number(page) || 0;
  limit = Number(limit) || 9;
  let skip = (page > 0 ? (page) * limit : 0);

  console.log("Processed values -> Skip:", skip, "Limit:", limit);
  const totalCountResponse=await User.aggregate([
    {
      $match: { 
              role: "Author"
            },
            
    },
    {
      $count:"totalDataCount"
    }

  ])
  const authors = await User.find({ role: "Author" }).skip(skip).limit(limit);

  if (authors.length === 0) {
      throw new ApiError(404, "No authors found");
  }
  const response={
    total:totalCountResponse[0]?.totalDataCount || 0,
    allAuthors:authors
  }
  return res.status(200).json(
      new ApiResponse(200, response, "All authors fetched successfully")
  );
});

const getAllUserBlog=asyncHandler(async(req,res)=>{
    const user=req.user
   
    const allBlogs=await User.aggregate(
        [
            {
              $match: {
                _id: new ObjectId(user._id) // Closing brace added here
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
const getUserProfile=asyncHandler(async(req,res)=>{
  const userId=req.user._id;
  const {id}=req.params;
  const otherUserId=id;
  
  if(!ObjectId.isValid(userId) || !ObjectId.isValid(otherUserId) )
  {
      throw new ApiError(404,"Inavalid Id")
  }
  const otherUserInfo= await User.findById(otherUserId).select("-password -refreshToken")
  if(!otherUserInfo)
  {
    throw new ApiError(500,"Something went wrong while fectching user info")
  }
  const SubResponse=await Subscriber.aggregate(
    [
      {
        $match:{
          authorId: new ObjectId(otherUserId)
        }
      },
      {
        $group: {
          _id: null,
          subscriberIds:{
            $addToSet:"$subscriberId"
          }
        }
      },
      {
        $project: {
          _id:0,
          subscribed:{
            $in:[ new ObjectId(userId), "$subscriberIds"]
          },
          SubscriberCount:{
            $size:"$subscriberIds"
          }
        }
      }
      
    ]
  )
  if(!SubResponse)
  {
      throw new ApiError(500,"Something went wrong while fetching subscriber")
  }
  let subscribed=false
 let subscriberCount=0
 if(SubResponse.length>0)
 {
   subscribed=SubResponse[0]?.subscribed
   subscriberCount=SubResponse[0]?.SubscriberCount

 }
//  console.log("SUbRESPONSE:",SubResponse)
 const allBlogs=await User.aggregate(
  [
      {
        $match: {
          _id: new ObjectId(otherUserId) // Closing brace added here
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
  if(!allBlogs)
  {
    throw new ApiError(500,"something went wrong while fetching user blog")
  }
  const userInfo={subscriberCount:subscriberCount,subscribed:subscribed,...otherUserInfo._doc,blogs:allBlogs}
  
  console.log("userInfo:",userInfo)
  return res.status(200).json(
  new ApiResponse(200,userInfo,"Successfully fetched user data")
  )
})
const googleRegister=asyncHandler(async (req,res)=>{
  console.log("called");
    const {credential}=req.body
    const credentialResponse=await jwtDecode(credential);
    // console.log("Response")
    console.log(credentialResponse)
    const email=credentialResponse.email;
    const password=credentialResponse.sub;
    const name=credentialResponse.given_name;
    const avatar=credentialResponse.picture || req.files['avatar[]']
    // console.log(req.files)
    const allowedFormat=["image/png","image/jpeg","image/webp"]
   
    const user = await User.findOne({ email });
    if (user) {
        throw new ApiError(404, "User with given email already exists");
    }
    const uploadRespone= await uploadOnCloudinary(avatar)
    if(!uploadRespone)
    {
        throw new ApiError(404,"Avatar File Is Missing!")
    }
    //console.log(uploadRespone)
    const response=await User.create({
      name,
      email,
      password,
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
  console.log("user create success");
  const {refreshToken,accessToken}=await genrateAccessTokenAndRefreshToken(createduser._id)

  return res.status(201)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
      new ApiResponse(201, createduser, "User registered successfully")
  );
})
const googleLogin=asyncHandler(async (req,res)=>{
  const {credential}=req.body;
  //console.log("called00")
  if(!credential)
  {
    throw new ApiError(404,"Invalid Credential || Please Try Again")
  }
  const credentialResponse= await jwtDecode(credential);
  const email=credentialResponse.email
  const password=credentialResponse.sub;
  if(!email || !password)
  {
    throw new ApiError(404,"Login unsccessful | please try again")
  }
  
  const user = await User.findOne({ email }).select("-createdAt -updatedAt");
  if(!user)
  {
    throw new ApiError(400,"Invalid Login || PLease Register First")
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid credential. Please try again.");
    }
  const userId=user._id;
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(404, "Invalid userId");
  }
  const response = await Subscriber.aggregate([
    { $match: { authorId: new ObjectId(userId) } },
    { $count: "SubscriberCount" },
  ]);
  if (!response) {
    throw new ApiError(500, "Something went wrong while fetching subscriber count");
  }
  const subscriberCount = response.length === 0 ? "0" : response[0]?.SubscriberCount || "0";
  const userWithSubscriptionCount = { subscriberCount, ...user._doc };

  const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(user._id);
  
    // Set cookies and respond with success
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(201, userWithSubscriptionCount, "User logged in successfully"));
  });

export {
    register,
    login,
    logout,
    getMyProfile,
    getAllAuthors,
    getAllUserBlog,
    getUserProfile,
    googleRegister,
    googleLogin


};
