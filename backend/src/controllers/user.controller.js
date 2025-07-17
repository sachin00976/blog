import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userSchema.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subscriber } from "../models/subscriberSchema.js";
import { ObjectId } from "mongodb";
import { jwtDecode } from "jwt-decode";
import mongoose from "mongoose";

const genrateAccessTokenAndRefreshToken = async (userid) => {
  try {
    if (!userid) throw new ApiError(400, "user id not found")
    const user = await User.findById(userid)
    if (!user) throw new ApiError(404, "No user found")
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken
    user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "error occur while genrating tokens")
  }
}

const options = {
  httpOnly: true,
  secure: false,
  sameSite: "Lax"
};

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User is authenticated")
  );
});

const register = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "User Avatar Required!")
  }
  const avatar = req.files.avatar || req.files['avatar[]']
  const allowedFormat = ["image/png", "image/jpeg", "image/webp"]
  if (!allowedFormat.includes(avatar.mimetype)) {
    throw new ApiError(400, "Invalid file type. Please provide your avatar in png, jpg or webp format.")
  }
  const { name, email, password, phone, role, education } = req.body;
  if (!name || !email || !password || !phone || !role || !education) {
    throw new ApiError(400, "Please fill all details!");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(404, "User with given email already exists");
  }
  const uploadRespone = await uploadOnCloudinary(avatar.tempFilePath)
  if (!uploadRespone) {
    throw new ApiError(500, "Avatar File Is Missing!")
  }
  await User.create({
    name,
    email,
    password,
    phone,
    role,
    education,
    avatar: {
      public_id: uploadRespone.public_id,
      url: uploadRespone.secure_url,
    }
  });
  // Fetch the created user
  const createduser = await User.findOne({ email });
  if (!createduser) {
    throw new ApiError(500, "Internal DB server error! Please try again");
  }
  // Return successful response
  const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(createduser._id)

  return res.status(201)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(
      new ApiResponse(201, createduser, "User registered successfully")
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, "Please enter all fields to login");
  }

  const user = await User.findOne({ email }).select("+password -createdAt -updatedAt");
  if (!user) {
    throw new ApiError(400, "Invalid credentials! Please enter correct email.");
  }

  const userId = user._id;

  // Fetch subscriber count for the user
  const response = await Subscriber.aggregate([
    { $match: { authorId: userId } },
    { $count: "SubscriberCount" },
  ]);

  if (!response) {
    throw new ApiError(500, "Something went wrong while fetching subscriber count");
  }

  // Extract subscriber count or default to 0
  const subscriberCount = response[0]?.SubscriberCount ?? 0;

  // Prepare user object with subscription count
  const userWithSubscriptionCount = { subscriberCount, ...user._doc };

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password. Please try again.");
  }

  // Validate role
  if (user.role !== role) {
    throw new ApiError(400, "Invalid role. Please enter the correct role!");
  }

  // Generate access and refresh tokens
  const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(user._id);

  console.log("In backend \n");
  console.log("accessToken:", accessToken)
  console.log("refreshToken:", refreshToken)

  // Set cookies and respond with success
  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, userWithSubscriptionCount, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
  const user = req.user

  user.refreshToken = null
  await user.save({ validateBeforeSave: false })

  return res.status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(201, {}, "User logged out Successfully!")
    )
})

const getMyProfile = asyncHandler(async (req, res) => {
  let user = req.user;
  const userId = user._id
  const response = await Subscriber.aggregate(
    [
      {
        $match: {
          authorId: userId
        }
      },
      {
        $count: 'SubscriberCount'
      }
    ]
  )
  if (!response) {
    throw new ApiError(500, "Something went wrong while fetching subscriber")
  }
  const subscriberCount = response[0]?.SubscriberCount ?? 0;
  const userWithSubscriptionCount = { subscriberCount: subscriberCount, ...req.user._doc }

  return res.status(200).json(
    new ApiResponse(200, userWithSubscriptionCount, "Successfully fetched user data")
  )
})

const getAllAuthors = asyncHandler(async (req, res) => {
  let { query, page = 0, limit = 8 } = req.query;

  page = Number(page) || 0;
  limit = Number(limit) || 8;
  const skip = page * limit;

  const baseFilter = { role: "Author" };
  let searchFilter = { ...baseFilter };

  if (query && query.trim() !== "") {
    const regex = new RegExp(query, "i");
    searchFilter = {
      ...baseFilter,
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } }
      ]
    };
  }

  const total = await User.countDocuments(searchFilter);
  const authors = await User.find(searchFilter)
    .skip(skip)
    .limit(limit)
    .select("-password -refreshToken -__v  -updatedAt");

  if (!authors.length) {
    return res.status(200).json(
      new ApiResponse(200, { total: 0, allAuthors: [] }, "NO author was found")
    )
  }

  const response = {
    total,
    allAuthors: authors
  };

  return res.status(200).json(
    new ApiResponse(200, response, "Authors fetched successfully")
  );
});

const getAllUserBlog = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const allBlogsResponse = await User.aggregate([
    {
      $match: {
        _id: userId
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
        blogs: 1,
        _id: 0
      }
    },
  ]);
  const allBlogs = allBlogsResponse[0].blogs
  const userInfo = await User.findById(userId);
  if (!allBlogsResponse || !userInfo) {
    throw new ApiError(500, "Error Occured While Fetching Users Blogs")
  }
  allBlogs.forEach(blog => {
    blog.authorAvatar = userInfo.avatar;
    blog.authorName = userInfo.name;
  });

  return res.status(200).json(
    new ApiResponse(200, { blogs: allBlogs }, "All user's blogs fetched successfully")
  );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { id: otherUserId } = req.params;

  if (!ObjectId.isValid(otherUserId)) {
    throw new ApiError(400, "Inavalid Id")
  }
  const otherUserInfo = await User.findById(otherUserId).select("-password -refreshToken")
  if (!otherUserInfo) {
    throw new ApiError(404, "Requested user not found")
  }
  otherUserId = otherUserInfo._id
  const SubResponse = await Subscriber.aggregate(
    [
      {
        $match: {
          authorId: otherUserId
        }
      },
      {
        $group: {
          _id: "$authorId",
          subscriberIds: {
            $addToSet: "$subscriberId"
          }
        }
      },
      {
        $project: {
          _id: 0,
          subscribed: {
            $in: [userId, "$subscriberIds"]
          },
          SubscriberCount: {
            $size: "$subscriberIds"
          }
        }
      }

    ]
  )
  if (!SubResponse) {
    throw new ApiError(500, "Something went wrong while fetching subscriber")
  }
  let subscribed = false
  let subscriberCount = 0
  subscribed = SubResponse[0]?.subscribed
  subscriberCount = SubResponse[0]?.SubscriberCount
  const allBlogsResponse = await User.aggregate([
    {
      $match: {
        _id: otherUserId
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
        blogs: 1,
        _id: 0
      }
    },

  ]);
  const allBlogs = allBlogsResponse[0].blogs
  if (!allBlogsResponse) {
    throw new ApiError(500, "Error Occured While Fetching Users Blogs")
  }
  allBlogs.forEach(blog => {
    blog.authorAvatar = otherUserInfo.avatar;
    blog.authorName = otherUserInfo.name;
  });
  const userInfo = { subscriberCount, subscribed, ...otherUserInfo._doc, blogs: allBlogs }

  return res.status(200).json(
    new ApiResponse(200, userInfo, "Successfully fetched user data")
  )
})

const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Invalid Credential || Please Try Again");
  }

  const credentialResponse = await jwtDecode(credential);
  const email = credentialResponse.email;
  const password = credentialResponse.sub;
  const name = credentialResponse.given_name;
  const avatar = credentialResponse.picture || req.files?.['avatar[]'];
  let user = await User.findOne({ email }).select("+password -createdAt -updatedAt");;

  if (!user) {

    const uploadResponse = await uploadOnCloudinary(avatar);
    if (!uploadResponse) {
      throw new ApiError(404, "Avatar File Is Missing!");
    }

    await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      },
    });

    user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(500, "Internal DB server error! Please try again");
    }

  } else {
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid credential. Please try again.");
    }

    const userId = user._id;
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
    user = { subscriberCount, ...user._doc };
  }

  const { refreshToken, accessToken } = await genrateAccessTokenAndRefreshToken(user._id || user._doc?._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, user, "User logged in sucessfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found. Please Try Again");
  }

  const { name, phone, education } = req.body;
  if (!name || !phone || !education) {
    throw new ApiError(404, "Some input field value is missing, please try again.");
  }

  const newUserData = {
    name,
    phone,
    education,
  };

  if (req.files && Object.keys(req.files).length > 0) {
    const avatar = req.files.avatar || req.files["avatar[]"];
    const allowedFormat = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormat.includes(avatar.mimetype)) {
      throw new ApiError(
        400,
        "Invalid file type. Please provide your avatar in png, jpg or webp format."
      );
    }

    const uploadResponse = await uploadOnCloudinary(avatar.tempFilePath);
    if (!uploadResponse) {
      throw new ApiError(500, "Failed To Upload New Profile. Please Try Again");
    }

    if (user.avatar?.public_id) {
      await deleteOnCloudinary(user.avatar.public_id);
    }

    newUserData.avatar = {
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "User Updated Successfully")
  );
});

const mostSubscribedAuthor = asyncHandler(async (req, res) => {
  const authors = await User.aggregate([
    {
      $lookup: {
        from: "subscribers",
        localField: "_id",
        foreignField: "authorId",
        as: "subCount"
      }
    },
    {
      $addFields: {
        subCount: {
          $size: {
            $ifNull: ["$subCount", []]
          }
        }
      }
    },
    {
      $sort: {
        subCount: -1
      }
    },
    {
      $project: {
        refreshToken: 0,
        password: 0,
        updatedAt: 0,
        createdAt: 0,
        __v: 0
      }
    },
    {
      $limit: 10
    }
  ]);

  if (!authors) {
    throw new ApiError(404, "Error occurred while fetching most subscribed authors");
  }

  return res.status(200).json(
    new ApiResponse(200, authors, "Most subscribed authors fetched successfully")
  );
});

const searchAuthors = asyncHandler(async (req, res) => {
  let { query, page = 0, limit = 8 } = req.query;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  page = Number(page);
  limit = Number(limit);
  const skip = page * limit;

  const regex = new RegExp(query, "i");

  const searchFilter = {
    role: "Author",
    $or: [
      { name: { $regex: regex } },
      { email: { $regex: regex } }
    ]
  };


  const total = await User.countDocuments(searchFilter);


  const authors = await User.find(searchFilter)
    .skip(skip)
    .limit(limit)
    .select("-password -refreshToken -__v -createdAt -updatedAt");

  return res.status(200).json(
    new ApiResponse(200, { total, authors }, "Search results fetched successfully")
  );
});

export {
  register,
  login,
  logout,
  getMyProfile,
  getAllAuthors,
  getAllUserBlog,
  getUserProfile,
  googleAuth,
  updateUserProfile,
  mostSubscribedAuthor,
  getCurrentUser
};
