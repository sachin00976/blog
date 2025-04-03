import React, { useEffect, useState, useRef, useCallback } from "react";
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

  const observerRef = useRef(null); // Reference for the intersection observer

  const fetchAuthors = useCallback(async () => {
    try {
      setLoader(true);
      const response = await axios.get("/api/v1/user/authors", {
        params: { skip, limit: limit + 1 },
      });

      const data = response.data.data;
      setAllAuthorData((prevData) => [...prevData, ...data.slice(0, limit)]);
      setHasNext(data.length > limit);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch authors");
    } finally {
      setLoader(false);
    }
  }, [skip]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  useEffect(() => {
    if (!hasNext) return; // Stop observing if no more authors

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSkip((prevSkip) => prevSkip + limit); // Load more authors when sentinel is visible
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNext]);

  if (error) return <ErrorComp data={error} />;
  if (loader && skip === 0) return <Loader />; // Show loader only for the initial load

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900 py-10 px-5">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Meet Our Authors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allAuthorData.length > 0 ? (
          allAuthorData.map((author) => (
            <div
              key={author._id}
              onClick={() => navigate(`/userProfile/${author._id}`)}
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

      {/* Invisible div to trigger infinite scrolling */}
      {hasNext && <div ref={observerRef} className="h-10"></div>}
    </div>
  );
}

export default AllAuthors;
