import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorComp from "../../utility/ErrorPage";
import Loader from "../../utility/Loader";
import { LuSearch } from 'react-icons/lu';
import axios from "../../utility/AxiosInstance";
import { Helmet } from 'react-helmet-async'

function AllAuthors() {
  const navigate = useNavigate();
  const [allAuthorData, setAllAuthorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/authors?page=${pageNo}&limit=${limit}&query=${searchTerm}`);
      setAllAuthorData(response.data.data.allAuthors);
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
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  if (error) return <ErrorComp data={error} />;
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-gray-900 py-10 px-5">
      <Helmet>
        <title>{`All authors - ${import.meta.env.VITE_APP_NAME}`}</title>
      </Helmet>
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0">Meet Our Authors</h1>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 rounded-full bg-white/20 text-white border border-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-white/80"
            />
            <button
              onClick={fetchData}
              type="button"
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white"
            >
              <LuSearch size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allAuthorData.length > 0 ? (
            allAuthorData.map((author) => (
              <div
                key={author._id}
                onClick={() => navigate(`/userProfile/${author._id}`)}
                className="bg-white/10 backdrop-blur-md border border-white/30 p-6 rounded-2xl flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-purple-300 cursor-pointer"
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
            <p className="text-white text-center text-lg col-span-full">No authors found.</p>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
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
              className={`px-4 py-2 rounded ${pageNo === i ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black'
                }`}
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
    </div>
  );
}

export default AllAuthors;
