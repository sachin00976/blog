import React from 'react'
import useApiHandler from '../../utility/ApiHandler'
import ErrorComp from '../../utility/ErrorPage'
import Loader from '../../utility/Loader'
import { useParams } from 'react-router-dom'
import { Context } from '../../AppWrapper'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Comments from '../miniComponents/comments'
import axios from '../../utility/AxiosInstance'
import DOMPurify from "dompurify";

function SingleBlog() {
  const { id } = useParams();
  const { user } = useContext(Context);
  const navigate = useNavigate();
  if (!user) {
    navigate('/login')
  }
  const deleteBlogHandler = async () => {

    try {
      const config = {
        method: "delete",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/deletePost/${id}`,
        data: ''
      }
      const response = await axios(config);
      if (response) {
        toast.success("Blog deleted successfully");
        navigate('/')
      }
    } catch (error) {
      console.log("error occur while deleting the blog:", error.message);
      toast.error(error?.response?.data?.message || "FAILED TO DELETE | PLEASE TRY AGAIN");

    }

  }
  const { res, data, error, loader } = useApiHandler({
    url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/singleBlog/${id}`,
  });

  if (error) return <ErrorComp data={error} />;
  if (loader) return <Loader />;

  return (
    <>
      <article>
        {data && (
          <section className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-12 shadow-lg">
            {/* Category */}
            <div className="text-5xl font-bold text-white uppercase tracking-wider rounded-3xl text-center bg-opacity-75 bg-[#38235d] py-4 px-6">
              {data.category}
            </div>

            {/* Edit & Delete Buttons */}
            {user && user._id === data.createdBy && (
              <div className="mt-10 text-center flex justify-center gap-4">
                <button
                  onClick={() => navigate(`/blog/update/${data._id}`)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={deleteBlogHandler}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
                >
                  Delete
                </button>
              </div>
            )}



            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white text-center rounded-2xl pb-4">
              {data.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center space-x-4 justify-center">
              <img
                src={data.authorAvatar}
                alt="author_avatar"
                className="w-20 h-20 rounded-full shadow-xl border-4 border-[#38235d]"
              />
              <p className="text-xl md:text-2xl text-white font-bold font-serif">
                {data.authorName}
              </p>
            </div>

            {/* Main Image */}
            {data.mainImage && (
              <div className="flex justify-center">
                <img
                  src={data.mainImage.url}
                  alt="mainBlogImg"
                  className="w-[73%] h-auto rounded-2xl shadow-xl border-4 border-[#38235d]"
                />
              </div>
            )}

            {/* Introduction */}
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.intro) }} className="text-lg md:text-2xl leading-relaxed text-white font-medium font-serif text-center" />

            {/* Section 1 */}
            <div className="space-y-6">
              <h3 className="text-3xl text-white font-extrabold underline decoration-[#6c4dcc] decoration-4 underline-offset-4">
                {data.paraOneTitle}
              </h3>
              {data.paraOneImage && (
                <div className="flex justify-center">
                  <img
                    src={data.paraOneImage.url}
                    alt="paraOneImg"
                    className="w-[73%] h-auto rounded-2xl shadow-xl border-4 border-[#38235d]"
                  />
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.paraOneDescription) }} className="text-xl md:text-2xl text-white font-medium font-serif" />
            </div>

            {/* Section 2 */}
            <div className="space-y-6">
              <h3 className="text-3xl text-white font-extrabold underline decoration-[#6c4dcc] decoration-4 underline-offset-4">
                {data.paraTwoTitle}
              </h3>
              {data.paraTwoImage && (
                <div className="flex justify-center">
                  <img
                    src={data.paraTwoImage.url}
                    alt="paraTwoImg"
                    className="w-[73%] h-auto rounded-2xl shadow-xl border-4 border-[#38235d]"
                  />
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.paraTwoDescription) }} className="text-xl md:text-2xl text-white font-medium font-serif" />
            </div>

            {/* Section 3 */}
            <div className="space-y-6">
              <h3 className="text-3xl text-white font-extrabold underline decoration-[#6c4dcc] decoration-4 underline-offset-4">
                {data.paraThreeTitle}
              </h3>
              {data.paraThreeImage && (
                <div className="flex justify-center">
                  <img
                    src={data.paraThreeImage.url}
                    alt="paraThreeImg"
                    className="w-[73%] h-auto rounded-2xl shadow-xl border-4 border-[#38235d]"
                  />
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.paraThreeDescription) }} className="text-xl md:text-2xl text-white font-medium font-serif" />
            </div>
          </section>
        )}
      </article>
      {user && (
        <div className="fixed">
          <Comments />
        </div>
      )}
    </>
  );
}

export default SingleBlog;
