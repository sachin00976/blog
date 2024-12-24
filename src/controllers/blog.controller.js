import { Blog } from "../models/blogSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const blogPost = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(404, "Blog Main Image File Is Missing!");
  }

  const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;

  if (!mainImage) {
    throw new ApiError(404, "Blog Main File Is Required");
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
  const authorAvatar = req.user.avatar;

  if (!title || !category || !intro) {
    throw new ApiError(404, "Title, Category, and Intro are required fields");
  }

  const uploadPromise = [
    uploadOnCloudinary(mainImage.tempFilePath),
    paraOneImage ? uploadOnCloudinary(paraOneImage.tempFilePath) : Promise.resolve(null),
    paraTwoImage ? uploadOnCloudinary(paraTwoImage.tempFilePath) : Promise.resolve(null),
    paraThreeImage ? uploadOnCloudinary(paraThreeImage.tempFilePath) : Promise.resolve(null),
  ];
  const [mainImageRes,paraOneRes,paraTwoRes,paraThreeRes]=await Promise.all(uploadPromise)
  if(
    !mainImageRes || mainImage.error
    || (paraOneImage && (!paraOneRes ))
    || (paraTwoImage && (!paraTwoRes))
    || (paraThreeImage && (!paraThreeRes))
 
)
{
    throw new ApiError(500,"Error Occur while uploading the images")
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

  return res.status(201).json(
    new ApiResponse(201, blog, "Blog Uploaded Successfully!")
  );
});
const deleteBlog=asyncHandler(async (req,res)=>{

  const {id}=req.params 
  if(!id)
  {
    throw new ApiError(404,"Inavlid Request To Delete A Blog Without ID")
  }

  const blog=await Blog.findById(id)

  if(!blog)
  {
    throw new ApiError(404,"Blog Not Found!")
  }

  const delRes=await blog.deleteOne()

  return res.status(200).json(
    new ApiResponse(200,delRes,"blog deleted successfully")
  )
})
const getAllBlogs=asyncHandler(async (req, res)=>
{
  const aggregate = Blog.aggregate();
}
)
export { 
  blogPost,
  deleteBlog,

 };
