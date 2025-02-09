import React, { useState, useEffect } from 'react';
import useApiHandler from '../../utility/ApiHandler';
import ErrorComp from '../../utility/ErrorPage';
import Loader from '../../utility/Loader';
import { Link } from 'react-router-dom';
function HeroSection() {
  // Assuming `useApiHandler` is an async hook that handles the API call
  const { res, data, error, loader } = useApiHandler({
    url: "/api/v1/blog/getAllBlog"
  });
  {console.log(res)}

  if (error) {
    {console.log("error page is encountered")}
    return (
      <>
        <ErrorComp data={error} />
      </>
    );
  }

  if (loader) {
    return (
      <>
        <Loader />
      </>
    );
  }
  

  // Make sure `data` is an array before mapping over it
  return (
    
    <div className='flex flex-wrap  bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 '>
      {data !== null && data.length !== 0 && data.map((blog) => (
        
        <Link
          to={`/blog/${blog._id}`}
          key={blog._id}
          className="bg-gray-200 text-black w-[23vw] m-3 rounded-xl shadow-lg overflow-hidden "
        >
          {/* Image Section */}
          <div className="h-40">
            <img
              src={blog.mainImage.url}
              className="w-full h-full object-cover"
              alt="Blog Cover"
            />
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Category */}
            <div className="inline-block px-3 py-1 bg-black text-white font-bold text-sm rounded-full mb-2">
              {blog.category}
            </div>

            {/* Title */}
            <div className="text-lg font-bold text-gray-800">{blog.title}</div>

            {/* User Info */}
            <div className="flex items-center mt-4">
              <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src={blog.authorAvatar}
                  alt={blog.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="ml-2 text-gray-700 font-medium">{blog.authorName}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default HeroSection;
