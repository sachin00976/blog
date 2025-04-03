import React, { useState, useEffect } from "react";
import useApiHandler from "../../utility/ApiHandler";
import ErrorComp from "../../utility/ErrorPage";
import Loader from "../../utility/Loader";
import { Link } from "react-router-dom";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import axios from "axios";

function FollowedBlogs() {
  const [blogData, setBlogData] = useState(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = [
    "All", "Travel", "Anime", "Lifestyle", "Education", "Tech",
    "Gaming", "Health", "Food", "Finance", "Business", "Art",
    "Music", "Photography", "Science", "Sports", "Movies", "Books",
    "History", "Other"
  ];

  const visibleTags = 6; // Number of tags to show initially
  const displayedTags = showAllTags ? tags : tags.slice(0, visibleTags);

  const getDataQuery = async (queryType) => {
    setLoader(true);
    try {
      const response = await axios.get(`/api/v1/blog/getAllBlog`, {
        params: {
          tag: queryType, // send tag in query string
        },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setBlogData(response.data.data);
      console.log("data: ", response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (data) {
      setBlogData(data);
    }
  }, [data]);

  if (error || apiError) {
    console.log("Error page is encountered");
    return <ErrorComp data={error || apiError} />;
  }

  if (loader || apiLoader) {
    return <Loader />;
  }

  return (
    <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 p-6">
      {/* Title */}
      <h1 className="text-white text-3xl font-bold text-center mb-6">BLOGS</h1>

      {/* Tags search */}
      <div className="flex flex-wrap items-center gap-3">
        {displayedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              getDataQuery(tag);
              setSelectedTag(tag);
            }}
            className={`${
              tag === selectedTag
                ? "bg-purple-500 text-white"
                : "bg-purple-700 text-white"
            } px-4 py-2 rounded-full transition-all duration-300 hover:bg-purple-500 shadow-md`}
          >
            {tag}
          </button>
        ))}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setShowAllTags(!showAllTags)}
          className="ml-auto flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full transition-all duration-300 hover:bg-gray-300 shadow-md"
        >
          {showAllTags ? "Collapse" : "Expand"}
          {showAllTags ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
        </button>
      </div>

      {/* Blog Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-5">
        {blogData !== null &&
          blogData.length !== 0 &&
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

export default HeroSection;
