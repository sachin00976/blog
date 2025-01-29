import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import useApiHandler from '../../utility/ApiHandler';
import ErrorComp from '../../utility/ErrorPage';
import Loader from '../../utility/Loader';
function UpdateBlog() {
 const {id}=useParams();
  
  const [generalError, setGeneralError] = useState("");
  
  const navigate = useNavigate();


  const { res, data,error, loader }=useApiHandler({
    url:`/api/v1/blog/singleBlog/${id}`,
    method:"get"
  })
  
  const { register, handleSubmit, formState: { errors }, reset ,watch} = useForm({
    defaultValues: {
      title: "",
      category: "",
      mainImage: "",
      intro: "",
      paraOneTitle: "",
      paraOneDescription: "",
      paraOneImage: "",
      paraTwoTitle: "",
      paraTwoDescription: "",
      paraTwoImage: "",
      paraThreeTitle: "",
      paraThreeDescription: "",
      paraThreeImage: null,
      published: true,
    },
  });

  // Reset form values when `data` is updated
  useEffect(() => {
    if (data) {
      reset({
        title: data.title || "",
        category: data.category || "",
        mainImage: data.mainImage?.url || null,
        intro: data.intro || "",
        paraOneTitle: data.paraOneTitle || "",
        paraOneDescription: data.paraOneDescription || "",
        paraOneImage: data.paraOneImage?.url || null,
        paraTwoTitle: data.paraTwoTitle || "",
        paraTwoDescription: data.paraTwoDescription || "",
        paraTwoImage: data.paraTwoImage?.url || null,
        paraThreeTitle: data.paraThreeTitle || "",
        paraThreeDescription: data.paraThreeDescription || "",
        paraThreeImage: data.paraThreeImage?.url || null,
        published: data.published || true,
      });
    }
  }, [data, reset]);
  const selectedMainImage = watch("mainImage");
  const selectedParaOneImage = watch("paraOneImage");
  const selectedParaTwoImage = watch("paraTwoImage");
  const selectedParaThreeImage = watch("paraThreeImage");
  
  console.log("selescted_main:",selectedMainImage)
  
// Generate previews for all images based on the given logic
const mainImagePreview =
  typeof selectedMainImage === "string" && selectedMainImage
    ? selectedMainImage
    : selectedMainImage && selectedMainImage[0]
    ? URL.createObjectURL(selectedMainImage[0])
    : null;

const paraOneImagePreview =
  typeof selectedParaOneImage === "string" && selectedParaOneImage
    ? selectedParaOneImage
    : selectedParaOneImage && selectedParaOneImage[0]
    ? URL.createObjectURL(selectedParaOneImage[0])
    : null;

const paraTwoImagePreview =
  typeof selectedParaTwoImage === "string" && selectedParaTwoImage
    ? selectedParaTwoImage
    : selectedParaTwoImage && selectedParaTwoImage[0]
    ? URL.createObjectURL(selectedParaTwoImage[0])
    : null;

const paraThreeImagePreview =
  typeof selectedParaThreeImage === "string" && selectedParaThreeImage
    ? selectedParaThreeImage
    : selectedParaThreeImage && selectedParaThreeImage[0]
    ? URL.createObjectURL(selectedParaThreeImage[0])
    : null;

// Cleanup logic to prevent memory leaks
useEffect(() => {
  // Array of previews
  const previews = [
    mainImagePreview,
    paraOneImagePreview,
    paraTwoImagePreview,
    paraThreeImagePreview,
  ];

  // Cleanup function
  return () => {
    previews.forEach((preview) => {
      if (preview && typeof preview !== "string") {
        URL.revokeObjectURL(preview); // Revoke object URLs
      }
    });
  };
}, [mainImagePreview, paraOneImagePreview, paraTwoImagePreview, paraThreeImagePreview]);



  const createBlogHandler = async (formData) => {
    
    console.log("from data:",formData)
    try {
      setGeneralError(null);
      const config={
        url:`/api/v1/blog/update/${data._id}`,
        method:"put",
        data:formData,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
     const response= await axios(config)

     if(response && response.data)
     {
        toast.success(response.data.message)
        navigate('/')
     }
      
    } catch (error) {
      console.error(error);
      setGeneralError(error.response?.data?.message || error.message || "Unexpected error occurred while creating the blog");
    }
  };

  return (
    <div className="bg-[#200a3e] min-h-screen flex flex-col">


      {/* Header */}
      <header className="bg-[#2f0c5f] text-white py-6 px-10">
        <h1 className="text-3xl font-bold">Edit Blog</h1>
      </header>

    {/* General Error */}
    {generalError && (
        <div className="text-center mt-4">
          <p className="bg-red-100 text-red-700 p-3 rounded">{generalError}</p>
        </div>
      )}


     {data ? (
     <form onSubmit={handleSubmit(createBlogHandler)}>



     {/* Main Content */}
     <div className="flex flex-col md:flex-row flex-grow p-10 space-y-8 md:space-y-0 md:space-x-8">
      {/* Left Section */}
      <div className="flex-1 bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Blog Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Blog Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter blog title"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("title", {
              required: "Blog title is required",
              minLength: {
                value: 10,
                message: "Blog title must be at least 10 characters long",
              },
            })}
          />
          {errors.title && <p className="text-sm text-red-500 mt-2">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            id="category"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Game">Game</option>
            <option value="Anime">Anime</option>
          </select>
          {errors.category && <p className="text-sm text-red-500 mt-2">{errors.category.message}</p>}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
        {/* Main Image */}
        <div>
          <label htmlFor="mainImage" className="block text-gray-700 font-medium mb-2">Main Image</label>
          <input
            id="mainImage"
            type="file"
            accept="image/*"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("mainImage")}
          />
          {errors.mainImage && <p className="text-sm text-red-500 mt-2">{errors.mainImage.message}</p>}

          {mainImagePreview && (
            <div className="mt-4">
              <p className="text-gray-700 text-sm mb-2">Image Preview:</p>
              <img
                src={mainImagePreview}
                alt="Selected Main Image"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Blog intro Editor */}
    <div className="bg-white shadow-md rounded-lg p-6 mx-10 mt-6 flex-grow">
      <label htmlFor="intro" className="block text-gray-700 font-medium mb-2">Blog intro</label>
      <textarea
        id="intro"
        rows="2"
        placeholder="blog intro..."
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...register("intro", {
          required: "Blog content is required",
          minLength: {
            value: 10,
            message: "Content must be at least 10 characters long",
          },
        })}
      ></textarea>
      {errors.intro && <p className="text-sm text-red-500 mt-2">{errors.intro.message}</p>}
    </div>




    {/* Para One Section */}
    <div className="flex flex-col md:flex-row flex-grow p-10 space-y-8 md:space-y-0 md:space-x-8">
      <div className="flex-1 bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Para One Title */}
        <div>
          <label htmlFor="paraOneTitle" className="block text-gray-700 font-medium mb-2">Para One Title</label>
          <input
            id="paraOneTitle"
            type="text"
            placeholder="Enter para one title"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("paraOneTitle")}
          />
          {errors.paraOneTitle && <p className="text-sm text-red-500 mt-2">{errors.paraOneTitle.message}</p>}
        </div>

        {/* Para One Description */}
        <div>
          <label htmlFor="paraOneDescription" className="block text-gray-700 font-medium mb-2">Para One Description</label>
          <textarea
            id="paraOneDescription"
            rows="6"
            placeholder="Enter para one description"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("paraOneDescription")}
          ></textarea>
          {errors.paraOneDescription && <p className="text-sm text-red-500 mt-2">{errors.paraOneDescription.message}</p>}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
        {/* Para One Image */}
        <div>
          <label htmlFor="paraOneImage" className="block text-gray-700 font-medium mb-2">Para One Image</label>
          <input
            id="paraOneImage"
            type="file"
            accept="image/*"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("paraOneImage")}
          />
          {errors.paraOneImage && <p className="text-sm text-red-500 mt-2">{errors.paraOneImage.message}</p>}

          {paraOneImagePreview && (
            <div className="mt-4">
              <p className="text-gray-700 text-sm mb-2">Image Preview:</p>
              <img
                src={paraOneImagePreview}
                alt="Selected Para One Image"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>




          {/* Para Two Section */}
<div className="flex flex-col md:flex-row flex-grow p-10 space-y-8 md:space-y-0 md:space-x-8">
{/* Left Section */}
<div className="flex-1 bg-white shadow-md rounded-lg p-6 space-y-6">
  {/* Para Two Title */}
  <div>
    <label htmlFor="paraTwoTitle" className="block text-gray-700 font-medium mb-2">Para Two Title</label>
    <input
      id="paraTwoTitle"
      type="text"
      placeholder="Enter para two title"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...register("paraTwoTitle")}
    />
    {errors.paraTwoTitle && <p className="text-sm text-red-500 mt-2">{errors.paraTwoTitle.message}</p>}
  </div>

  {/* Para Two Description */}
  <div>
    <label htmlFor="paraTwoDescription" className="block text-gray-700 font-medium mb-2">Para Two Description</label>
    <textarea
      id="paraTwoDescription"
      rows="6"
      placeholder="Enter para two description"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...register("paraTwoDescription")}
    ></textarea>
    {errors.paraTwoDescription && <p className="text-sm text-red-500 mt-2">{errors.paraTwoDescription.message}</p>}
  </div>
</div>

{/* Right Section */}
<div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
  {/* Para Two Image */}
  <div>
    <label htmlFor="paraTwoImage" className="block text-gray-700 font-medium mb-2">Para Two Image</label>
    <input
      id="paraTwoImage"
      type="file"
      accept="image/*"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...register("paraTwoImage")}
    />
    {errors.paraTwoImage && <p className="text-sm text-red-500 mt-2">{errors.paraTwoImage.message}</p>}

    {paraTwoImagePreview && (
      <div className="mt-4">
        <p className="text-gray-700 text-sm mb-2">Image Preview:</p>
        <img
          src={paraTwoImagePreview}
          alt="Selected Para Two Image"
          className="w-full h-48 object-cover rounded-lg border border-gray-300"
        />
      </div>
    )}
  </div>
</div>
</div>





{/* Para Three Section */}
<div className="flex flex-col md:flex-row flex-grow p-10 space-y-8 md:space-y-0 md:space-x-8">
{/* Left Section */}
<div className="flex-1 bg-white shadow-md rounded-lg p-6 space-y-6">
  {/* Para Three Title */}
  <div>
    <label htmlFor="paraThreeTitle" className="block text-gray-700 font-medium mb-2">Para Three Title</label>
    <input
      id="paraThreeTitle"
      type="text"
      placeholder="Enter para three title"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...register("paraThreeTitle")}
    />
    {errors.paraThreeTitle && <p className="text-sm text-red-500 mt-2">{errors.paraThreeTitle.message}</p>}
  </div>

  {/* Para Three Description */}
  <div>
    <label htmlFor="paraThreeDescription" className="block text-gray-700 font-medium mb-2">Para Three Description</label>
    <textarea
      id="paraThreeDescription"
      rows="6"
      placeholder="Enter para three description"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...register("paraThreeDescription")}
    ></textarea>
    {errors.paraThreeDescription && <p className="text-sm text-red-500 mt-2">{errors.paraThreeDescription.message}</p>}
  </div>
</div>

{/* Right Section */}
<div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
  {/* Para Three Image */}
  <div>
    <label htmlFor="paraThreeImage" className="block text-gray-700 font-medium mb-2">Para Three Image</label>
    <input
      id="paraThreeImage"
      type="file"
      accept="image/*"
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...register("paraThreeImage")}
    />
    {errors.paraThreeImage && <p className="text-sm text-red-500 mt-2">{errors.paraThreeImage.message}</p>}

    {paraThreeImagePreview && (
      <div className="mt-4">
        <p className="text-gray-700 text-sm mb-2">Image Preview:</p>
        <img
          src={paraThreeImagePreview}
          alt="Selected Para Three Image"
          className="w-full h-48 object-cover rounded-lg border border-gray-300"
        />
      </div>
    )}
  </div>
</div>
</div>



    {/* Published button */}
   <div className='ml-10 mr-10 r'>
   <div class="flex flex-col md:flex-row flex-grow p-4 space-y-8 md:space-y-0 md:space-x-8 bg-white rounded-xl shadow-md text-lg "> 
<label 
  for="published" 
  class="block text-gray-700 font-medium mb-2 pt-2"
>
  Publish
</label>
<select 
  id="published" 
  {...register("published")} 
  class="border w-full border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
>
  <option value={true}>True</option>
  <option value={false}>False</option>
</select>
</div>
   </div>




    {/* Submit Button */}
    <div className="p-10">
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-xl font-extrabold"
      >
        Submit
      </button>
    </div>
   </form>
     ):(error?(
      
        <>
        <ErrorComp data={error}/>
        
        </>
      
     ):(
      
        <>
        <Loader/>
        </>
      
     ))}

      
    </div>
  );
}

export default UpdateBlog;
