import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userSchema.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  let accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) throw new ApiError(401, "User not found with access token");
      req.user = user;
      return next();
    }

    if (!refreshToken) throw new ApiError(401, "Refresh token not found");

    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedRefresh.id).select("-password");
    if (!user) throw new ApiError(401, "User not found with refresh token");

    accessToken = await user.generateAccessToken();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 60 * 1000, 
    });

    req.user = user;
    next();

  } catch (err) {
    throw new ApiError(401, err.message || "Authentication failed");
  }
});

export { verifyJWT };
