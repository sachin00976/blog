import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiUsers,
} from "react-icons/fi";
import { useContext } from "react";
import { Context } from "../../AppWrapper";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const { setUser, isAuthenticated, setIsAuthenticated, user } = useContext(Context);
  const logoutHandler = async () => {
    try {
      const config = {
        url: "/api/v1/user/logout",
        method: "get",
        headers: {
          "Content-Type": "multipart/form-data",
        }

      }
      const response = await axios(config)
      if (response && response.data) {
        setUser(null)
        setIsAuthenticated(false)
        toast.success(response.data.message)
        navigate('/')

      }


    } catch (error) {
      console.log(error);

      toast.error(error.response.message || error.message || "Unexpected occured while logouting the user")
    }

  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition"
        >
          {isCollapsed ? (
            <FiMenu className="w-6 h-6" />
          ) : (
            <FiX className="w-6 h-6" />
          )}
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 
          ${isCollapsed ? "-translate-x-full" : "translate-x-0"} 
          w-64`}
      >
        <div className="flex justify-end p-4">
        </div>

        <nav className="flex flex-col space-y-2 px-6 pt-10">
          {user && (<>
            <div
              className="flex items-center p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition duration-200"
              onClick={() => {
                toggleSidebar();
                navigate("/followings");
              }}
            >
              <FiUsers className="text-blue-600" size={20} />
              <span className="ml-3 text-lg font-semibold text-blue-700">Followings</span>
            </div>
            <div
              className="flex items-center p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition duration-200"
              onClick={() => {
                toggleSidebar();
                navigate("/followedBlogs");
              }}
            >
              <FiUsers className="text-blue-600" size={20} />
              <span className="ml-3 text-lg font-semibold text-blue-700">Subscribed Blogs</span>
            </div></>)}
        </nav>

        {user && (
          <>
            <div className="absolute bottom-4 w-full px-6">
              <button
                className="w-full flex items-center justify-center py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                onClick={() => logoutHandler()}
              >
                Logout
              </button>
            </div>
          </>
        )}
        {!user && (
          <>
            <div className="absolute bottom-4 w-full px-6">
              <button
                className="w-full flex items-center justify-center py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                onClick={() => {
                  navigate("/login")
                }}
              >
                Login
              </button>
            </div>
          </>
        )}
      </div>

      {!isCollapsed && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
