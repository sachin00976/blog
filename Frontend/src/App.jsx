import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from './AppWrapper'
import { useContext } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Sidebar from './components/miniComponents/sidebar'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated, setBlogs } = useContext(Context)
  useEffect(() => {
    setIsAuthenticated(false)
    setUser(null)
    setBlogs(null)
    navigate('/')

  }, [navigate])
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <Sidebar />
        <Navbar />
        <Outlet />
        <Footer />
        <Toaster />
      </GoogleOAuthProvider>
    </>
  )
}

export default App
