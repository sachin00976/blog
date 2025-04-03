import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorComp from "../../utility/ErrorPage";
import Loader from "../../utility/Loader";

function AllAuthors() {
  const navigate = useNavigate();
  const [allAuthorData, setAllAuthorData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/user/authors?skip=${pageNo * limit}&limit=${limit}`);
      setAllAuthorData(response.data.data.allAuthorInfo);
      setTotalPages(Math.ceil(response.data.data.total / limit));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setPageNo(page);
      fetchData(page, limit);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  if (error) return <ErrorComp data={error} />;
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 py-10 px-5">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Meet Our Authors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allAuthorData.length > 0 ? (
          allAuthorData.map((author) => (
            <div
              key={author._id}
              onClick={() => navigate(`/blog/userProfile/${author._id}`)}
              className="border-4 border-white p-6 rounded-lg flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:border-purple-300 cursor-pointer"
            >
              <img
                src={author?.avatar?.url || "/default-avatar.png"}
                alt="User Profile"
                className="w-32 h-32 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-110 hover:border-purple-300"
              />
              <div className="text-center text-white">
                <h2 className="text-xl font-semibold mb-2">{author.name}</h2>
                <p className="text-sm mb-1">
                  <span className="font-medium">Email: </span>
                  {author.email || "Not Available"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Joined: </span>
                  {author.createdAt ? new Date(author.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center text-lg">No authors found.</p>
        )}
      </div>
      {/* Pagination */}
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

export default AllAuthors;
