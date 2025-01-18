import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userSchema.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Corrected: Use req.cookies instead of req.cookie
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    //console.log(token)
    if (!token) {
      throw new ApiError(400, "Token not found!");
    }
    
    // Verify the token
    const decodedToken = jwt.verify(String(token), process.env.ACCESS_TOKEN_SECRET);

   // console.log(decodedToken)
    
    // Find the user based on the decoded token's ID
    const user = await User.findById(decodedToken.id);
    
    if (!user) {
      throw new ApiError(400, "Invalid Token");
    }
    
    // Attach the user object to the request object
    req.user = user;

    // Call the next middleware in the stack
    next();
  } catch (error) {
    // Handle errors and provide a meaningful message
    throw new ApiError(401, error.message || "Invalid access token");
  }
});

export { verifyJWT };
