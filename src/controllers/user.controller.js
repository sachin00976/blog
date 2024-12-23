import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


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
    const avatar=req.files.avatar
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
    console.log(uploadRespone)
    await User.create({
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
    return res.status(201).json(
        new ApiResponse(201, createduser, "User registered successfully")
    );
});
const login=asyncHandler(async(req,res)=>{
    const {email,password,role}=req.body
    console.log(email+" "+password+" "+role)
    if(!email || !password || !role)
    {
        throw new ApiError(404,"Please enter all fields to login")
    }
    const user=await User.findOne({email}).select(
        "-createdAt -updatedAt "
    
    )
    if(!user)
    {
        throw new ApiError(400,"Please enter correct credintals!")
    }
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid)
    {
        throw new ApiError(404,"Please enter a valid password")
    }

    if(user.role!==role)
    {
        throw new ApiError(404,"Please enter correct role!")
    }
    const {refreshToken,accessToken}=await genrateAccessTokenAndRefreshToken(user._id)
    //console.log(accessToken)
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        
        new ApiResponse(201,user,"User logged in successfully")
        
    )

})
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
    const user=req.user;

    return res.status(200).json(
        new ApiResponse(200,user,"Successfully fetched user data")
    )
})
const getAllAuthors=asyncHandler(async (req,res)=>{
    const authors=await User.find({role:"Author"})

    return res.status(200).json(
        new ApiResponse(200,authors,"All authors fetched successfully")
    )
})
export {
    register,
    login,
    logout,
    getMyProfile,
    getAllAuthors,


};
