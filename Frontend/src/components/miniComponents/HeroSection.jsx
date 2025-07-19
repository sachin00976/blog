import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApiHandler from "../../utility/ApiHandler";
import ErrorComp from "../../utility/ErrorPage";
import Loader from "../../utility/Loader";
import { Link } from "react-router-dom";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from "../../utility/AxiosInstance";
import socket from "../../../src/socket/index"

function HeroSection() {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [bestAuthors, setBestAuthors] = useState([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");

  let { res, data, error: apiError, loader: apiLoader } = useApiHandler({
    url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/getAllBlog`,
  });

  const tags = [
    "Technology", "Health", "Travel", "Food", "Lifestyle", "Finance", "Finance",
    "Finance", "Education", "Entertainment", "Game", "Anime", "Testing"
  ];

  const visibleTags = 6;
  const displayedTags = showAllTags ? tags : tags.slice(0, visibleTags);

  const getDataQuery = async (queryType) => {
    setLoader(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/getAllBlog`, {
        params: {
          tag: queryType,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setBlogData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoader(false);
    }
  };

  const fetchBestAuthors = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/mostSubsAuthor`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setBestAuthors(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoader(false);
    }
  };

  // socket events
  useEffect(() => {
    socket.on('newBlogCreated', (newBlog) => {
      setBlogData((prevBlogs) => [newBlog, ...(prevBlogs || [])]);
    });

    socket.on('blogUpdated', ({ id, blog }) => {
      setBlogData((prevBlogs) =>
        prevBlogs?.map((b) => (b._id === id ? blog : b)) || []
      );
    });

    socket.on('blogDeleted', (id) => {
      setBlogData((prevBlogs) =>
        prevBlogs?.filter((b) => (b._id !== id)) || []
      );
    });

    // cleanups
    return () => {
      socket.off('newBlogCreated');
      socket.off('blogUpdated');
      socket.off('blogDeleted');
    };
  }, []);

  useEffect(() => {
    fetchBestAuthors();
    if (data) {
      setBlogData(data);
    }
  }, [data]);

  if (error || apiError) {
    return <ErrorComp data={error || apiError} />;
  }

  if (loader || apiLoader) {
    return <Loader />;
  }

  return (
    <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 p-6">
      {bestAuthors.length > 0 && (
        <div className="my-10">

          {bestAuthors.length > 0 && (
            <div className="my-10 bg-purple-900 bg-opacity-30 py-10 px-4 rounded-xl shadow-lg">
              <h2 className="text-white text-2xl font-bold mb-6 text-center">Top Authors</h2>

              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                  1280: { slidesPerView: 4 },
                  1024: { slidesPerView: 3 },
                  768: { slidesPerView: 2 },
                  0: { slidesPerView: 1 },
                }}
              >
                {bestAuthors.map((author) => (
                  <SwiperSlide key={author._id} onClick={() => navigate(`/userProfile/${author._id}`)}>
                    <div className="bg-transparent border border-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                      <img
                        src={author?.avatar?.url}
                        alt={author.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white mb-4"
                      />
                      <h3 className="text-lg font-bold text-white cursor-pointer"  >{author.name}</h3>
                      <p className="text-sm text-white">{author.email}</p>
                      <p className="mt-2 text-white font-semibold">
                        Subscribers: {author.subCount}
                      </p>

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

        </div>
      )}

      <h1 className="text-white text-3xl font-bold text-center mb-6">BLOGS</h1>

      <div className="flex flex-wrap items-center gap-3">
        {displayedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              getDataQuery(tag);
              setSelectedTag(tag);
            }}
            className={`${tag === selectedTag
              ? "bg-purple-500 text-white"
              : "bg-purple-700 text-white"
              } px-4 py-2 rounded-full transition-all duration-300 hover:bg-purple-500 shadow-md`}
          >
            {tag}
          </button>
        ))}

        <button
          onClick={() => setShowAllTags(!showAllTags)}
          className="ml-auto flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full transition-all duration-300 hover:bg-gray-300 shadow-md"
        >
          {showAllTags ? "Collapse" : "Expand"}
          {showAllTags ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
        </button>
      </div>

      {blogData === null || blogData.length === 0 ? (
        <div className="text-white text-center mt-10 text-lg font-semibold flex justify-center items-center min-h-[50vh]">
          No blogs found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-5 min-h-[50vh]">
          {blogData.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              className="bg-white text-black rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="h-44 relative">
                <img
                  src={blog.mainImage.url}
                  className="w-full h-full object-cover rounded-t-2xl"
                  alt="Blog Cover"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white text-base font-bold px-4 py-2 rounded-full shadow-md uppercase tracking-wide">
                  {blog.category}
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight hover:text-purple-700 transition">
                  {blog.title}
                </h2>
                <div className="w-full h-[2px] bg-gray-300 my-3"></div>
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
      )}
    </div>
  );
}

export default HeroSection;
