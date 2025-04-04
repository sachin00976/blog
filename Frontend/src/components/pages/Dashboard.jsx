import React from 'react'
import {Context} from '../../AppWrapper'
import { useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useApiHandler from '../../utility/ApiHandler'
import ErrorComp from '../../utility/ErrorPage'
import { Link } from 'react-router-dom'
import Sidebar from '../miniComponents/sidebar'
function Dashboard() {
  const {user}=useContext(Context)
  console.log("user:",user);
  const navigate=useNavigate()
  const {res,data,error,loader}=useApiHandler({
    url:"/api/v1/user/allUserBlog"
  })
  if(error)
  {
    return (
      <>
      <ErrorComp data={error}/>
      </>
    )
  }
// const public_id = "gcg05pdvyalvktarqdp3";
// const url = "https://res.cloudinary.com/dglfefyow/image/upload/v1735930830/gcg05pdvyalvktarqdp3.jpg";
// const _id = "677833cdb57b2afbb1603a9b";
// const name = "sachin";
// const email = "sacone@gmail.com";
// const phone = "12345678";
// const education = "B.Tech";
// const role = "Author";
// const password = "$2b$10$Wntupv6POWH31skwBJ8mI.IbSCC05.ayd4ULpUlECV0XvnuawDNNG";
// const __v = 0;
// const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzgzM2NkYjU3YjJhZmJiMTYwM2E5YiIsImlhdCI6MTczNjA5NTI5NywiZXhwIjoxNzM2OTU5Mjk3fQ.dA2mF6Qi5q4-1DsqmhNGXcdWGgwdJShorKIvTA5mcJk";

  return (
    <>
    <Sidebar />
    <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 text-white py-10 px-12 rounded-lg shadow-lg">
      {/* Heading */}
      <h2 className="text-center text-5xl font-extrabold tracking-wide mb-10">User Profile</h2>
  
      {/* User profile info */}
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
        {/* Left section - image */}
        <div className="flex-shrink-0 w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-purple-300">
          <img className="w-full h-full object-cover" src={user.avatar.url} alt="User Avatar" />
        </div>
  
        {/* Right section - user info */}
        <div className="text-lg space-y-4">
          <h2 className="text-2xl font-bold mb-4">{user.name }</h2>
          <div className="space-y-2">
            <div className="flex  items-center">
              <span className="text-purple-300 font-medium">Role:</span>
              <p className="ml-2 ">{user.role }</p>
            </div>
            <div className="flex  items-center">
              <span className="text-purple-300 font-medium">Email:</span>
              <p className="ml-2 ">{user.email }</p>
            </div>
            <div className="flex items-center">
              <span className="text-purple-300 font-medium">Phone:</span>
              <p className="ml-2">{user.phone }</p>
            </div>
            <div className="flex items-center">
              <span className="text-purple-300 font-medium">Education:</span>
              <p className="ml-2">{user.education }</p>
            </div>
            <div className="flex items-center">
              <span className="text-purple-300 font-medium">Followers:</span>
              <p className="ml-2">{`${user.subscriberCount ? user.subscriberCount : 0}`}</p>

            </div>
          </div>
        </div>
      </div>
  
     
      <div className="flex gap-4 mt-10 justify-center">
         {/* Button to create a new blog */}
  {user.role==="Author"?(<button
    onClick={() => navigate('/blogs')}
    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
  >
    Create New Blog
  </button>):null}

  {/* <button
    onClick={() => navigate('/editProfile')}
    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
  >
    Edit Profile
  </button> */}
  </div>
  
      {/* User Blogs */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold mb-4">Blogs</h2>
        {loader ? (
          <h2 className='text-3xl font-semibold mb-4'>Loading...</h2>
        ):
        (
          
          <div className='flex flex-wrap gap-10 bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 '>
       {data && data !== null && data.blogs?.length !== 0 && data.blogs.map((blog) => (
        
        <Link
          to={`/blog/${blog._id}`}
          key={blog._id}
          className="bg-gray-200 text-black w-[18vw] m-3 rounded-xl shadow-lg overflow-hidden "
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
          <div className="p-4 h-30">
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
                  src={blog.authorAvatar.url}
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
          
        )
        }
      </div>
    </div>
  </>
  
  )
}

export default Dashboard
