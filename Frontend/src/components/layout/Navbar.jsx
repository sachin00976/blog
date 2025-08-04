import React, { useContext, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { GiCurlyWing } from "react-icons/gi";
import { Menu } from "lucide-react";
import { Context } from "../../AppWrapper";
import toast from "react-hot-toast";
import LoaderOverlay from "../../utility/LoaderOverlay";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet"
import axios from "../../utility/AxiosInstance";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false)
  const isDashboard = location.pathname.startsWith("/dashboard")
  const isHome = location.pathname === '/'
  const isAllAuthors = location.pathname.startsWith("/authors")
  const isAbout = location.pathname.startsWith("/about")
  const isBlogs = location.pathname.startsWith("/blogs")
  const isFollowings = location.pathname.startsWith("/followings")
  const isSubscribedBlogs = location.pathname.startsWith("/followedBlogs")
  const { setUser, isAuthenticated, setIsAuthenticated, user } = useContext(Context);

  const logoutHandler = async () => {
    try {
      setLoading(true)
      const config = {
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
        method: "get",
        headers: {
          "Content-Type": "multipart/form-data",
        }
      };
      await axios(config);
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.message || error.message || "Unexpected error during logout");
    } finally{
      setLoading(false)
    }
  };

  const navLinks = (
    <>
      <NavItem to="/">Home</NavItem>
      {isHome && <NavItem to="/authors">All Authors</NavItem>}
      {isHome && <NavItem to="/about">About</NavItem>}
      {isAuthenticated && <NavItem to="/dashboard">Dashboard</NavItem>}
      {isAuthenticated && isDashboard && <NavItem to="/blogs">Create Blogs</NavItem>}
      {isAuthenticated && isDashboard && <NavItem to="/followings">Followings</NavItem>}
      {isAuthenticated && isDashboard && <NavItem to="/followedBlogs">Subscribed blogs</NavItem>}
    </>
  );

  return (
    <header className="w-full bg-[#41098E] text-white shadow-md px-4 py-2">
      {loading && <LoaderOverlay />}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Section: Logo + Brand */}
        <div className="flex items-center gap-3">
          <GiCurlyWing size={45} />
          <span className="text-2xl font-semibold tracking-wide">Blogi</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-lg font-semibold items-center">
          {navLinks}
        </nav>

        {/* Right Section: Avatar + Auth */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user?.avatar?.url && (
            <img
              src={user.avatar.url}
              alt="User Avatar"
              className="w-12 h-12 object-cover rounded-full border-2 border-gray-200 shadow-md hover:shadow-lg transition"
              onClick={() => navigate("/dashboard")}
            />
          )}
          {isAuthenticated ? (
            <button
              onClick={logoutHandler}
              className="bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 transition text-sm"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 px-3 py-1.5 rounded-md hover:bg-green-700 transition text-sm"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="text-white">
              <Menu size={28} />
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#41098E] text-white w-48">
              <div className="mt-8 flex flex-col gap-6 text-xl font-semibold">
                {navLinks}
                <div className="mt-4">
                  {isAuthenticated ? (
                    <button
                      onClick={logoutHandler}
                      className="bg-red-600 w-full py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="bg-green-600 w-full py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `transition-all hover:text-purple-300 hover:scale-110 ${
        isActive ? "text-orange-400 font-extrabold" : "text-white"
      }`
    }
  >
    {children}
  </NavLink>
);

export default Navbar;
