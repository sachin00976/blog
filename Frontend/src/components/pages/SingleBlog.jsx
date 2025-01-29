import React from 'react'
import useApiHandler from '../../utility/ApiHandler'
import ErrorComp from '../../utility/ErrorPage'
import Loader from '../../utility/Loader'
import { useParams } from 'react-router-dom'
import { Context } from '../../AppWrapper'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {UpdateBlog} from './index.js'
function SingleBlog() {
  const {id}=useParams()
  const {user}=useContext(Context);
  const navigate=useNavigate();
  const {res,data,error,loader}=useApiHandler(
    {
      url:`/api/v1/blog/singleBlog/${id}`
    }
  )
  if(error)
  {
    return (
      <ErrorComp data={error}/>
    )
  }
  if(loader)
  {
    return (
      <Loader/>
    )
  }

  return (
    <>
   <article>
   {data && (
  <section className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-12 rounded-xl shadow-lg">
    {/* Category */}
    <div className="text-5xl font-bold text-white uppercase tracking-wider rounded-3xl text-center bg-opacity-75 bg-[#38235d] py-4 px-6">
      {data.category}
    </div>
    {user && data && user._id===data.createdBy ?(
         <div className="mt-10 text-center">
         <button
           onClick={() => navigate(`/blog/update/${data._id}`)}
           className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
         >
           Edit
         </button>
       </div>
    ):null}

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
      <img
        src={data.mainImage.url}
        alt="mainBlogImg"
        className="w-full h-[15%] rounded-xl shadow-lg border-2 border-[#38235d]"
      />
    )}

    {/* Introduction */}
    <p className="text-lg md:text-2xl leading-relaxed text-white font-medium font-serif text-center">
      {data.intro}
    </p>

    {/* Section 1 */}
    <div className="space-y-6">
      <h3 className="text-3xl text-white font-extrabold underline decoration-[#6c4dcc] decoration-4 underline-offset-4">
        {data.paraOneTitle}
      </h3>
      {data.paraOneImage && (
        <img
          src={data.paraOneImage.url}
          alt="paraOneImg"
          className="w-full rounded-xl shadow-lg border-2 border-[#38235d]"
        />
      )}
      <p className="text-xl md:text-2xl text-white font-medium font-serif">
        {data.paraOneDescription}
      </p>
    </div>

    {/* Section 2 */}
    <div className="space-y-6">
      <h3 className="text-3xl text-white font-extrabold underline decoration-[#6c4dcc] decoration-4 underline-offset-4">
        {data.paraTwoTitle}
      </h3>
      {data.paraTwoImage && (
        <img
          src={data.paraTwoImage.url}
          alt="paraTwoImg"
          className="w-full h-[25%] rounded-xl shadow-lg border-2 border-[#38235d]"
        />
      )}
      <p className="text-xl md:text-2xl text-white font-medium font-serif">
        {data.paraTwoDescription}
      </p>
    </div>

    {/* Section 3 */}
    <div className="space-y-6">
      <h3 className="text-3xl text-white font-extrabold underline decoration-[#6c4dcc] decoration-4 underline-offset-4">
        {data.paraThreeTitle}
      </h3>
      {data.paraThreeImage && (
        <img
          src={data.paraThreeImage.url}
          alt="paraThreeImg"
          className="w-full rounded-xl shadow-lg border-2 border-[#38235d]"
        />
      )}
      <p className="text-xl md:text-2xl text-white font-medium font-serif">
        {data.paraThreeDescription}
      </p>
      
    </div>
  </section>
  )}
</article>


    </>
  )
}

export default SingleBlog
