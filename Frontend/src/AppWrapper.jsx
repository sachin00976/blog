import { createContext, useEffect, useState } from "react"
import Router from './Router'
import { RouterProvider } from 'react-router-dom'
import axios from "./utility/AxiosInstance";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Loader from "./utility/Loader";
import { HelmetProvider } from 'react-helmet-async';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Context = createContext(null)

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({})
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const config = {
          method: "get",
          url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
          withCredentials: true
        };
        const response = await axios(config);
        setUser(response.data.data);
        setIsAuthenticated(true);
        setLoading(false)
      } catch (error) {
        setUser({});
        setIsAuthenticated(false);
        setLoading(false)
      }
    };

    checkAuth();
  }, []);

  if (loading) return <Loader />

  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <Context.Provider
          value={{
            user,
            setUser,
            isAuthenticated,
            setIsAuthenticated,
            blogs,
            setBlogs,
            loading
          }}
        >
          <RouterProvider router={Router} />
        </Context.Provider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  )
}
export { Context, AppWrapper }
