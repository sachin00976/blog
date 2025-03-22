import { Blog } from "../models/blogSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary,deleteOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const blogPost = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(404, "Blog Main Image File Is Missing!");
  }
  console.log(req.files)
  const mainImage= req.files['mainImage[]'];
  const paraOneImage  =req.files['paraOneImage[]'];
  const  paraTwoImage  = req.files['paraTwoImage[]'];
  const  paraThreeImage  = req.files['paraThreeImage[]'];
  
 
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
  // console.log("delete bolg called")
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
  const blogs = await Blog.aggregate(
    [
      {
        $match:{
          "published":true
        }
      },
      {
        $project:{
          published:0,
          createdAt:0,
          updatedAt:0,
          __v:0,

        }
      }
    ]
  );
  
  if(!blogs)
  {
    throw new ApiError(500,"Blogs Fteched Unsuccessful!")
  }

  return res.status(200).json(
    new ApiResponse(200,blogs,"Blogs fetched successfully")
  )
}
)

const getSingleBlog=asyncHandler(async (req,res)=>{


    const {id}=req.params
    
    if(!id)
    {
      throw new ApiError(404,"ID is invalid")
    }

    const blog=await Blog.findById(id).select("-published -__v -updatedAt -createdAt")

    if(!blog)
    {
      throw new ApiError(400,"Blog not found!")
    }
    return res.status(200).json(
      new ApiResponse(200,blog,"Blog fetched successfully!")
    )

}) 
const updateBlog=asyncHandler(async (req,res)=>{
  const {id}=req.params
  if(!id)
  {
    throw new ApiError(404,"Invalid id")
  }

  let blog=await Blog.findById(id)
  //console.log("req:",req.files)

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

  if(req.files)
  {
    const mainImage= req.files['mainImage[]'];
  const paraOneImage  =req.files['paraOneImage[]'];
  const  paraTwoImage  = req.files['paraTwoImage[]'];
  const  paraThreeImage  = req.files['paraThreeImage[]'];

    // if(!mainImage)
    // {
    //   throw new ApiError(404,"mainimage file is required!")
    // }

    const allowedFormat=["image/png","image/jpeg","image/webp"]
    if(
      (mainImage && !allowedFormat.includes(mainImage.mimetype))
      || (paraOneImage && !allowedFormat.includes(paraOneImage.mimetype))
      || (paraTwoImage && !allowedFormat.includes(paraTwoImage.mimetype))
      || (paraThreeImage && !allowedFormat.includes(paraThreeImage.mimetype))
    )
    {
      throw new ApiError(404,"Invalid file format. Only PNG, JPG and WEBp formats are allowed")
    }
  }

  if(req.files )
  {
    const mainImage= req.files['mainImage[]'];
  const paraOneImage  =req.files['paraOneImage[]'];
  const  paraTwoImage  = req.files['paraTwoImage[]'];
  const  paraThreeImage  = req.files['paraThreeImage[]'];
    if(mainImage)
    {
       const mainImageId=blog.mainImage.public_id
       deleteOnCloudinary(mainImageId)
       const newMainImage=await uploadOnCloudinary(mainImage.tempFilePath)
       newBlogData.mainImage={
        public_id:newMainImage.public_id,
        url:newMainImage.secure_url
       }
    }
    if(paraOneImage)
    {
      const paraOneImageId=blog.paraOneImage.public_id
      deleteOnCloudinary(paraOneImageId)
      const newParaOneImage=await uploadOnCloudinary(paraOneImage.tempFilePath)
      newBlogData.paraOneImage={
       public_id:newParaOneImage.public_id,
       url:newParaOneImage.secure_url
      }
    }
    if(paraTwoImage)
      {
        const paraTwoImageId=blog.paraTwoImage.public_id
        deleteOnCloudinary(paraTwoImageId)
        const newParaTwoImage=await uploadOnCloudinary(paraTwoImage.tempFilePath)
        newBlogData.paraTwoImage={
         public_id:newParaTwoImage.public_id,
         url:newParaTwoImage.secure_url
        }
      }
      if(paraThreeImage)
        {
          const paraThreeImageId=blog.paraThreeImage.public_id
          deleteOnCloudinary(paraThreeImageId)
          const newParaThreeImage=await uploadOnCloudinary(paraThreeImage.tempFilePath)
          newBlogData.paraThreeImage={
           public_id:newParaThreeImage.public_id,
           url:newParaThreeImage.secure_url
          }
        }
  }
  blog=await Blog.findByIdAndUpdate(id,newBlogData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
  return res.status(200).json(
    new ApiResponse(200,blog,"Blog updated successfully")
  )
})
export { 
  blogPost,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,

 };
