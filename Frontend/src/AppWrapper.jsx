import { createContext, useEffect, useState } from "react"
import Router from './Router'
import { RouterProvider } from 'react-router-dom'
import axios from "./utility/AxiosInstance";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Context = createContext(null)

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({})
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const config = {
          method: "get",
          url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
          credentials: "include"
        };
        const response = await axios(config);
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser({});
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Context.Provider
        value={{
          user,
          setUser,
          isAuthenticated,
          setIsAuthenticated,
          blogs,
          setBlogs,
        }}
      >
        <RouterProvider router={Router} />
      </Context.Provider>
    </GoogleOAuthProvider>
  )
}
export { Context, AppWrapper }
