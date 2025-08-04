import { Blog } from "../models/blogSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ObjectId } from "mongodb";
import { userSocketMap } from "../socket/index.js";

const blogPost = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(404, "Blog Main Image File Is Missing!");
  }
  const mainImage = req.files['mainImage[]'];
  const paraOneImage = req.files['paraOneImage[]'];
  const paraTwoImage = req.files['paraTwoImage[]'];
  const paraThreeImage = req.files['paraThreeImage[]'];


  if (!mainImage) {
    throw new ApiError(404, "Blog Main Image Is Required");
  }

  const allowedFormat = ["image/png", "image/jpeg", "image/webp"];

  if (
    !allowedFormat.includes(mainImage.mimetype) ||
    (paraOneImage && !allowedFormat.includes(paraOneImage.mimetype)) ||
    (paraTwoImage && !allowedFormat.includes(paraTwoImage.mimetype)) ||
    (paraThreeImage && !allowedFormat.includes(paraThreeImage.mimetype))
  ) {
    throw new ApiError(404, "Invalid file type. Only JPG, PNG and WEBP formats are allowed!");
  }

  const {
    title,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    paraThreeDescription,
    paraThreeTitle,
    category,
    published,
  } = req.body;

  const createdBy = req.user._id;
  const authorName = req.user.name;
  const authorAvatar = req.user.avatar.url;

  if (!title || !category || !intro) {
    throw new ApiError(404, "Title, Category, and Intro are required fields");
  }

  const uploadPromise = [
    uploadOnCloudinary(mainImage.tempFilePath),
    paraOneImage ? uploadOnCloudinary(paraOneImage.tempFilePath) : Promise.resolve(null),
    paraTwoImage ? uploadOnCloudinary(paraTwoImage.tempFilePath) : Promise.resolve(null),
    paraThreeImage ? uploadOnCloudinary(paraThreeImage.tempFilePath) : Promise.resolve(null),
  ];
  const [mainImageRes, paraOneRes, paraTwoRes, paraThreeRes] = await Promise.all(uploadPromise)
  if (
    !mainImageRes || mainImage.error
    || (paraOneImage && (!paraOneRes))
    || (paraTwoImage && (!paraTwoRes))
    || (paraThreeImage && (!paraThreeRes))

  ) {
    throw new ApiError(500, "Error Occur while uploading the images")
  }

  const blogData = {
    title,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    paraThreeDescription,
    paraThreeTitle,
    category,
    createdBy,
    authorAvatar,
    authorName,
    published,
    mainImage: {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    },
  };

  if (paraOneImage) {
    blogData.paraOneImage = {
      public_id: paraOneRes.public_id,
      url: paraOneRes.secure_url,
    };
  }

  if (paraTwoImage) {
    blogData.paraTwoImage = {
      public_id: paraTwoRes.public_id,
      url: paraTwoRes.secure_url,
    };
  }

  if (paraThreeImage) {
    blogData.paraThreeImage = {
      public_id: paraThreeRes.public_id,
      url: paraThreeRes.secure_url,
    };
  }

  const blog = await Blog.create(blogData);
  if (!blog) throw new ApiError(500, "Failed to create blog")

  const blogObj = blog.toObject(); 

  blogObj.authorAvatar = { url: authorAvatar };
  blogObj.authorName = authorName;

  req.io.emit('newBlogCreated', blogObj);

  const socketId = userSocketMap.get(req.user._id?.toString())

  if (socketId) {
    req.io.to(socketId).emit("myNewBlogCreated", blogObj);
  }

  return res.status(201).json(
    new ApiResponse(201, blog, "Blog Uploaded Successfully!")
  );
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Request: Missing or invalid blog ID");
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog Not Found!");
  }


  await deleteOnCloudinary(blog.mainImage.public_id);

  if (blog.paraOneImage) {
    await deleteOnCloudinary(blog.paraOneImage.public_id);
  }

  if (blog.paraTwoImage) {
    await deleteOnCloudinary(blog.paraTwoImage.public_id);
  }

  if (blog.paraThreeImage) {
    await deleteOnCloudinary(blog.paraThreeImage.public_id);
  }

  
  await blog.deleteOne();
  const delRes = await blog.deleteOne()

  if (!delRes) throw new ApiError(500, "Failed to delete blog")

  req.io.emit("blogDeleted", id)
  const socketId = userSocketMap.get(req.user._id?.toString())

  if (socketId) {
    req.io.to(socketId).emit("myOwnBlogDeleted", id);
  }

  return res.status(200).json(
    new ApiResponse(200, delRes, "blog deleted successfully")
  )
})

const getAllBlogs = asyncHandler(async (req, res) => {
  const { tag = "All" } = req.query;
  let filteredTag = tag === "All" ? "" : tag;

  const matchStage = { published: true };
  if (filteredTag) {
    matchStage.category = filteredTag;
  }

  const blogs = await Blog.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorInfo"
      }
    },
    {
      $addFields: {
        "authorInfo": { $arrayElemAt: ["$authorInfo", 0] }
      }
    },
    {
      $addFields: {
        "authorAvatar": "$authorInfo.avatar.url",
        "authorName": "$authorInfo.name"
      }
    },
    {
      $project: {
        authorInfo: 0,
        published: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
      }
    }
  ]);

  if (!blogs) {
    throw new ApiError(500, "Blogs Fetch Unsuccessful!");
  }

  return res.status(200).json(
    new ApiResponse(200, blogs, "Blogs fetched successfully")
  );
});


const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "ID is invalid");
  }

  const blog = await Blog.aggregate([
    {
      $match: { _id: new ObjectId(id) }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorInfo"
      }
    },
    {
      $addFields: {
        "authorInfo": { $arrayElemAt: ["$authorInfo", 0] }
      }
    },
    {
      $addFields: {
        "authorAvatar": "$authorInfo.avatar.url",
        "authorName": "$authorInfo.name"
      }
    },
    {
      $project: {
        authorInfo: 0, // Exclude authorInfo array
        published: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0
      }
    }
  ]);

  if (!blog || blog.length === 0) {
    throw new ApiError(400, "Blog not found!");
  }

  return res.status(200).json(
    new ApiResponse(200, blog[0], "Blog fetched successfully!")
  );
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!id) {
    throw new ApiError(404, "Invalid id")
  }

  const authorName = req.user.name;
  const authorAvatar = req.user.avatar.url;

  let blog = await Blog.findById(id)
  

  const newBlogData = {
    title: req.body.title,
    intro: req.body.intro,
    category: req.body.category,
    paraOneTitle: req.body.paraOneTitle,
    paraOneDescription: req.body.paraOneDescription,
    paraTwoTitle: req.body.paraTwoTitle,
    paraTwoDescription: req.body.paraTwoDescription,
    paraThreeTitle: req.body.paraThreeTitle,
    paraThreeDescription: req.body.paraThreeDescription,
    published: req.body.published,
  };

  if (req.files) {
    const mainImage = req.files['mainImage[]'];
    const paraOneImage = req.files['paraOneImage[]'];
    const paraTwoImage = req.files['paraTwoImage[]'];
    const paraThreeImage = req.files['paraThreeImage[]'];

    

    const allowedFormat = ["image/png", "image/jpeg", "image/webp"]
    if (
      (mainImage && !allowedFormat.includes(mainImage.mimetype))
      || (paraOneImage && !allowedFormat.includes(paraOneImage.mimetype))
      || (paraTwoImage && !allowedFormat.includes(paraTwoImage.mimetype))
      || (paraThreeImage && !allowedFormat.includes(paraThreeImage.mimetype))
    ) {
      throw new ApiError(404, "Invalid file format. Only PNG, JPG and WEBp formats are allowed")
    }
  }

  if (req.files) {
    const mainImage = req.files['mainImage[]'];
    const paraOneImage = req.files['paraOneImage[]'];
    const paraTwoImage = req.files['paraTwoImage[]'];
    const paraThreeImage = req.files['paraThreeImage[]'];
    if (mainImage) {
      const mainImageId = blog.mainImage.public_id
      await deleteOnCloudinary(mainImageId)
      const newMainImage = await uploadOnCloudinary(mainImage.tempFilePath)
      newBlogData.mainImage = {
        public_id: newMainImage.public_id,
        url: newMainImage.secure_url
      }
    }
    if (paraOneImage) {
      const paraOneImageId = blog.paraOneImage.public_id
      await deleteOnCloudinary(paraOneImageId)
      const newParaOneImage = await uploadOnCloudinary(paraOneImage.tempFilePath)
      newBlogData.paraOneImage = {
        public_id: newParaOneImage.public_id,
        url: newParaOneImage.secure_url
      }
    }
    if (paraTwoImage) {
      const paraTwoImageId = blog.paraTwoImage.public_id
      await deleteOnCloudinary(paraTwoImageId)
      const newParaTwoImage = await uploadOnCloudinary(paraTwoImage.tempFilePath)
      newBlogData.paraTwoImage = {
        public_id: newParaTwoImage.public_id,
        url: newParaTwoImage.secure_url
      }
    }
    if (paraThreeImage) {
      const paraThreeImageId = blog.paraThreeImage.public_id
      await deleteOnCloudinary(paraThreeImageId)
      const newParaThreeImage = await uploadOnCloudinary(paraThreeImage.tempFilePath)
      newBlogData.paraThreeImage = {
        public_id: newParaThreeImage.public_id,
        url: newParaThreeImage.secure_url
      }
    }
  }
  blog = await Blog.findByIdAndUpdate(id, newBlogData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  if (!blog) throw new ApiError(500, "Failed to update blog")

  const blogObj = blog.toObject(); 

  blogObj.authorAvatar = { url: authorAvatar };
  blogObj.authorName = authorName;

  console.log("BlogObj in backend: ", JSON.stringify(blogObj, null, 2))

  req.io.emit('blogUpdated', { id, blog });
  
  const socketId = userSocketMap.get(req.user._id?.toString())

  if (socketId) {
    req.io.to(socketId).emit("myBlogUpdated", {id, blogObj});
  }

  return res.status(200).json(
    new ApiResponse(200, blog, "Blog updated successfully")
  )
})
export {
  blogPost,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,

};
