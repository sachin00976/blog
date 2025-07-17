import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../AppWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import useApiHandler from '../../utility/ApiHandler';
import ErrorComp from '../../utility/ErrorPage';
import { Link } from 'react-router-dom';
import Loader from '../../utility/Loader';
import toast from 'react-hot-toast';
import axios from '../../utility/AxiosInstance';

function UserProfile() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();
  if(!user)
  {
    navigate('/login')
  }
  const { res, data, error, loader } = useApiHandler({
    url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/userProfile/${id}`,
  });

  // State for subscription status and subscriber count
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Set initial state when data is fetched
  useEffect(() => {
    if (data) {
      setIsSubscribed(data.subscribed);
      setSubscriberCount(data.subscriberCount);
    }
  }, [data]);

  const subscribesHandler = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscribe/newSubscriber/${id}`);
      if (response) {
        toast.success(response.data.message);
        setIsSubscribed(true);
        setSubscriberCount((prevCount) => prevCount + 1); // Increase count instantly
      }
    } catch (error) {
      console.error('Error while subscribing:', error);
      toast.error(error.response?.data?.message || 'Unexpected error while subscribing');
    }
  };

  const unsubscribesHandler = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscribe/deleteSubscriber/${id}`);
      if (response) {
        toast.success(response.data.message);
        setIsSubscribed(false);
        setSubscriberCount((prevCount) => Math.max(0, prevCount - 1)); // Decrease count instantly
      }
    } catch (error) {
      console.error('Error while unsubscribing:', error);
      toast.error(error.response?.data?.message || 'Unexpected error while unsubscribing');
    }
  };

  return (
    <>
      {data ? (
        <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 text-white py-10 px-12 rounded-lg shadow-lg">
          <h2 className="text-center text-5xl font-extrabold tracking-wide mb-10">
            User Profile
          </h2>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="flex-shrink-0 w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-purple-300">
              <img className="w-full h-full object-cover" src={data.avatar.url} alt="User Avatar" />
            </div>

            <div className="text-lg space-y-4">
              <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-purple-300 font-medium">Role:</span>
                  <p className="ml-2">{data.role}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-300 font-medium">Email:</span>
                  <p className="ml-2">{data.email}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-300 font-medium">Education:</span>
                  <p className="ml-2">{data.education}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-300 font-medium">Followers:</span>
                  <p className="ml-2">{subscriberCount}</p> {/* Updated count */}
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe/Unsubscribe Button */}
          <div className="mt-10 text-center">
            {isSubscribed ? (
              <button
                onClick={unsubscribesHandler}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
              >
                Unsubscribe
              </button>
            ) : (
              <button
                onClick={subscribesHandler}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
              >
                Subscribe
              </button>
            )}
          </div>

          {/* User Blogs */}
          <div className="mt-16">
            <h2 className="text-3xl font-semibold mb-4">Blogs</h2>
            <div className="flex flex-wrap gap-10 bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900">
              {data &&
                data?.blogs !== null &&
                data?.blogs.length !== 0 &&
                data?.blogs.map((blog) => (
                  <Link
                    to={`/blog/${blog._id}`}
                    key={blog._id}
                    className="bg-gray-200 text-black w-[18vw] m-3 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="h-40">
                      <img
                        src={blog.mainImage.url}
                        className="w-full h-full object-cover"
                        alt="Blog Cover"
                      />
                    </div>

                    <div className="p-4 h-30">
                      <div className="inline-block px-3 py-1 bg-black text-white font-bold text-sm rounded-full mb-2">
                        {blog.category}
                      </div>
                      <div className="text-lg font-bold text-gray-800">{blog.title}</div>
                      <div className="flex items-center mt-4">
                        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                          <img src={blog.authorAvatar.url} alt={blog.authorName} className="w-full h-full object-cover" />
                        </div>
                        <span className="ml-2 text-gray-700 font-medium">{blog.authorName}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <ErrorComp data={error} />
      ) : (
        <Loader />
      )}
    </>
  );
}

export default UserProfile;
