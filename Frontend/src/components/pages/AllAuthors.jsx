import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorComp from "../../utility/ErrorPage";
import Loader from "../../utility/Loader";

function AllAuthors() {
  const navigate = useNavigate();
  const [hasNext, setHasNext] = useState(false);
  const [allAuthorData, setAllAuthorData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const limit = 12;

  useEffect(() => {
    let isMounted = true; // Prevents memory leaks

    const fetchAuthors = async () => {
      try {
        setLoader(true);
        const response = await axios.get("/api/v1/user/authors", {
          params: { skip, limit: limit + 1 },
        });

        if (isMounted) {
          const data = response.data.data;
          console.log("Fetched Authors:", response);
          setAllAuthorData((prevData) => [...prevData, ...data.slice(0, limit)]);
          setHasNext(data.length > limit);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch authors");
        }
      } finally {
        if (isMounted) {
          setLoader(false);
        }
      }
    };

    fetchAuthors();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [skip]);

  // Function to handle "Next" button click without scrolling to top
  const handleNext = () => {
    const scrollPosition = window.scrollY; // Save current scroll position
    setSkip((prevSkip) => prevSkip + limit); // Load more authors
    setTimeout(() => {
      window.scrollTo({ top: scrollPosition, behavior: "instant" }); // Restore scroll position
    }, 0);
  };

  if (error) return <ErrorComp data={error} />;
  if (loader) return <Loader />;

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
      {hasNext && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleNext}
            className="bg-white text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-purple-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AllAuthors;
