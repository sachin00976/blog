import { createContext, useEffect, useState } from "react"
import Router from './Router'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Context = createContext(null)

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({})
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const val = localStorage.getItem('user');
    if (val) {
      setUser(JSON.parse(val));
      setIsAuthenticated(true);
    }
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
