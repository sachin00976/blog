import React, { useState, useEffect } from "react";
import useApiHandler from "../../utility/ApiHandler";
import ErrorComp from "../../utility/ErrorPage";
import Loader from "../../utility/Loader";
import { Link } from "react-router-dom";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import axios from "../../utility/AxiosInstance";

function FollowedBlogs() {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDataQuery = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/v1/subscribe/getUserSubscribedAuthorBlogs`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
     
      setBlogData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataQuery();
  }, []);

  if (error) {
    return <ErrorComp data={error} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 p-6">
      {/* Title */}
      <h1 className="text-white text-3xl font-bold text-center mb-6">BLOGS</h1>

      {/* Blog Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-5">
        {blogData !== null &&
          blogData?.length !== 0 &&
          blogData.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              className="bg-white text-black rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="h-44 relative">
                <img
                  src={blog.mainImage.url}
                  className="w-full h-full object-cover rounded-t-2xl"
                  alt="Blog Cover"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white text-base font-bold px-4 py-2 rounded-full shadow-md uppercase tracking-wide">
                  {blog.category}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                {/* Title */}
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight hover:text-purple-700 transition">
                  {blog.title}
                </h2>

                {/* Divider */}
                <div className="w-full h-[2px] bg-gray-300 my-3"></div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
                    <img
                      src={blog.authorAvatar}
                      alt={blog.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-700 font-medium">{blog.authorName}</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default FollowedBlogs;
