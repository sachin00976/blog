import React from 'react';

function BlogBlock({ image, category, title, userImage, userName ,id}) {
  return (
    <div
    key={id}
     className="bg-gray-100 text-black w-[25vw] m-3 rounded-lg shadow-lg overflow-hidden">
      {/* Image Section */}
      <div className="h-40">
        <img
          src={image}
          className="w-full h-full object-cover"
          alt="Blog Cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category */}
        <div className="inline-block px-3 py-1 bg-black text-white font-bold text-sm rounded-full mb-2">
          {category}
        </div>

        {/* Title */}
        <div className="text-lg font-bold text-gray-800">{title}</div>

        {/* User Info */}
        <div className="flex items-center mt-4">
          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={userImage}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="ml-2 text-gray-700 font-medium">{userName}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogBlock;
