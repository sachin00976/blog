import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorComp from '../../utility/ErrorPage';
import Loader from '../../utility/Loader';

function Followings() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscribe/allSubscribedAuhtorInfo?page=${pageNo}&limit=${limit}`);
      setData(response.data.data.allAuthorInfo);
      console.log("allAuth",response.data.data)
      setTotalPages(Math.ceil(response.data.data.total / limit));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo, limit]);

  if (error) return <ErrorComp data={error} />;
  if (loading) return <Loader />;

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setPageNo(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 py-10 px-5">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Your Followings</h1>
      <div className="flex justify-end mb-4">
        <label className="text-white mr-2">Items per page:</label>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={16}>16</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data && data.length > 0 ? (
          data.map((following) => (
            <div
              key={following.authorId}
              onClick={() => navigate(`/userProfile/${following.authorId}`)}
              className="border-4 border-white p-6 rounded-lg flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:border-purple-300"
            >
              <img
                src={following?.avatar?.url || '/default-avatar.png'}
                alt="Following Profile"
                className="w-32 h-32 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-110 hover:border-purple-300"
              />
              <div className="text-center text-white">
                <h2 className="text-xl font-semibold mb-2">{following.name}</h2>
                <h2 className="text-xl font-semibold mb-2">{following.email}</h2>
                <p className="text-sm mb-1">
                  <span className="font-medium">Subscribers: </span>{following.subscriberCount || 'Not Available'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center text-lg">No followings found.</p>
        )}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(pageNo - 1)}
          disabled={pageNo === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 ${pageNo === i ? 'bg-purple-500 text-white' : 'bg-gray-300'} rounded`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(pageNo + 1)}
          disabled={pageNo === totalPages - 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Followings;
