import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}

export default Loader;
