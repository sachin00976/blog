import React from "react";
import { NavLink ,useNavigate} from "react-router-dom";
import { GiCurlyWing } from "react-icons/gi";
import { useContext } from "react";
import { Context } from "../../AppWrapper";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Navbar = () => {
    const navigate=useNavigate();
     const {setUser,isAuthenticated,setIsAuthenticated,user} = useContext(Context);
    const logoutHandler=async()=>{
      try {
        const config={
          url:"/api/v1/user/logout",
          method:"get",
          headers: {
            "Content-Type": "multipart/form-data",
          }
          
        }
        const response=await axios(config)
        if(response && response.data)
        {
          setUser(null)
          setIsAuthenticated(false)
          localStorage.removeItem('user')
          localStorage.clear();
          toast.success(response.data.message)
          navigate('/')

        }


      } catch (error) {
        console.log(error);
        
        toast.error(error.response.message || error.message || "Unexpected occured while logouting the user")
      }

    }
  return (
    <>
      
      <nav className="w-full h-16 bg-[#41098E] text-white flex justify-between items-center px-8 shadow-lg">
        {/* Left Section: Logo and Website Name */}
        <div className="flex gap-4 items-center">
          <div className="text-2xl font-bold"><GiCurlyWing size={50} color='white'/></div>
          <div className="text-lg font-semibold tracking-wide">Blogi</div>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="flex items-center ">
          <ul className="flex gap-6 text-sm font-medium">
          <li className="transition-all hover:text-purple-300 hover:text-2xl text-xl font-bold">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                    isActive ? "text-orange-700 font-extrabold" : "text-white"
                    }
                >
                    Home
                </NavLink>
                
                </li>

                {isAuthenticated ? (
                  <li className="transition-all hover:text-purple-300 hover:text-2xl text-xl font-bold">
                  <NavLink
                      to="/blogs"
                      className={({ isActive }) =>
                      isActive ? "text-orange-700 font-extrabold" : "text-white"
                      }
                  >
                      Create Blogs
                  </NavLink>
                  
                  </li>
                ):(null)}
               {
                true? (
                  <li className="transition-all hover:text-purple-300 hover:text-2xl text-xl font-bold">
                  <NavLink
                      to="/authors"
                      className={({ isActive }) =>
                      isActive ? "text-orange-700 font-extrabold" : "text-white"
                      }
                  >
                      All Authors
                  </NavLink>
                  
                  </li>
                ):(null)
               }
                <li className="transition-all hover:text-purple-300 hover:text-2xl text-xl font-bold">
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                    isActive ? "text-orange-700 font-extrabold" : "text-white"
                    }
                >
                    About
                </NavLink>
                
                </li>
            {isAuthenticated && (
               <li className="transition-all hover:text-purple-300 hover:text-2xl text-xl font-bold">
               <NavLink
                   to="/dashboard"
                   className={({ isActive }) =>
                   isActive ? "text-orange-700 font-extrabold" : "text-white"
                   }
               >
                   Dashboard
               </NavLink>
               
               </li>
            )}
          </ul>
        </div>
          
        <div >
            {isAuthenticated && (
              <Link to={'/dashboard'}>
                <img
                  className="w-14 h-14 object-cover rounded-full border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
                  src={user.avatar.url}
                  alt="User Avatar"
                />
              </Link>
            )}
          </div>
        {/* Right Section: Login/Logout Button and userImage on login */}
        
                 

          <div>
          {isAuthenticated ? (
            <button
            onClick={logoutHandler}
             className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition-all">
              Logout
            </button>
          ) : (
            <button
            onClick={()=>navigate('/login')}
             className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-all">
              Login
            </button>
          )}
        </div>
        
      </nav>
    </>
  );
};

export default Navbar;
