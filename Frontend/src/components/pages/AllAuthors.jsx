import React from 'react';
import useApiHandler from '../../utility/ApiHandler';
import ErrorComp from '../../utility/ErrorPage';
import Loader from '../../utility/Loader';
import { useNavigate } from 'react-router-dom';
function AllAuthors() {
  const navigate=useNavigate();
  const { res, data, error, loader } = useApiHandler({
    url: '/api/v1/user/authors',
    method: 'get',
  });

  if (error) {
    return <ErrorComp data={error} />;
  }

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 py-10 px-5">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Meet Our Authors
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data && data.length !== 0 ? (
          data.map((author) => (
            <div
              onClick={()=>navigate(`/blog/userProfile/${author._id}`)}
              key={author._id}
              className="border-4 border-white p-6 rounded-lg flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:border-purple-300"
            >
              {/* Author Image */}
              <img
                src={author?.avatar?.url || '/default-avatar.png'}
                alt="User Profile"
                className="w-32 h-32 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-110 hover:border-purple-300"
              />
              {/* Author Info */}
              <div className="text-center text-white">
                {/* User Name */}
                <h2 className="text-xl font-semibold mb-2">{author.name}</h2>
                {/* Email */}
                <p className="text-sm mb-1">
                  <span className="font-medium">Email: </span>{author.email || 'Not Available'}
                </p>
                {/* Joined Date */}
                <p className="text-sm">
                  <span className="font-medium">Joined: </span>
                  {new Date(author.createdAt).toLocaleDateString() || 'Unknown'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center text-lg">No authors found.</p>
        )}
      </div>
    </div>
  );
}

export default AllAuthors;
