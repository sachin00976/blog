import { Comment } from "../models/commentSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../utils/AsyncHandler.js";

// Helper function to fetch all comments of a blog
const getAllComments = async (blogId) => {
  console.log("hello1")
  if (!ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid Blog ID");
  }

  const comments = await Comment.aggregate([
    { $match: { blogId: new ObjectId(blogId) } },
    { $sort: { createdAt: 1 } },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "authorInfo",
      },
    },
    {
      $addFields: {
        authorInfo: { $arrayElemAt: ["$authorInfo", 0] },
      },
    },
    {
      $project: {
        comment: 1,
        blogId:1,
        "authorInfo._id": 1,
        "authorInfo.name": 1,
        "authorInfo.avatar": 1,
      },
    },
  ]);

  return comments;
};

// Create a new comment
const createComment = asyncHandler(async (req, res) => {
  console.log("hello22keuw")
  const authorId = req.user.id;
  const { comment } = req.body;
  const { blogId } = req.params;

  if (!comment) {
    throw new ApiError(400, "Please enter a valid comment.");
  }

  const newComment = await Comment.create({ authorId, comment, blogId });
  if (!newComment) {
    throw new ApiError(500, "Failed to create comment. Please try again.");
  }

  const allComments = await getAllComments(blogId);

  return res.status(201).json(new ApiResponse(201, allComments, "Comment added successfully"));
});

// Get all comments for a blog
const getAllBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const allComments = await getAllComments(blogId);

  return res.status(200).json(new ApiResponse(200, allComments, "Blog comments fetched successfully"));
});

// Edit a comment
const editComment = asyncHandler(async (req, res) => {
  const { commentId, blogId } = req.params;
  const { newComment } = req.body;
  const userId = req.user._id;


  console.log("commentId: ", commentId, "blogId: ", blogId, "newComment: ", newComment, "userId: ", userId);

  if (!ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  if (!comment.authorId.equals(userId)) {
    throw new ApiError(403, "Unauthorized request.");
  }

  comment.comment = newComment;
  await comment.save();

  const allComments = await getAllComments(blogId);

  return res.status(200).json(new ApiResponse(200, allComments, "Comment updated successfully"));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId, blogId } = req.params;
  const userId = req.user._id;

  if (!ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  if (!comment.authorId.equals(userId)) {
    throw new ApiError(403, "Unauthorized request.");
  }

  await Comment.deleteOne({ _id: new ObjectId(commentId) });

  const allComments = await getAllComments(blogId);

  return res.status(200).json(new ApiResponse(200, allComments, "Comment deleted successfully"));
});

export {
  createComment,
  getAllBlogComments,
  editComment,
  deleteComment,
};
