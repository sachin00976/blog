import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect, useContext } from 'react'
import { Context } from './AppWrapper'
import Sidebar from './components/miniComponents/sidebar'
function App() {
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated, setBlogs } = useContext(Context)
  return (
    <>
      <Sidebar />
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
    </>
  )
}

export default App
