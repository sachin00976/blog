import React from 'react'
import { Outlet } from 'react-router-dom'
import  Navbar  from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from './AppWrapper'
import { useContext } from 'react'
function App() {
  const navigate=useNavigate()
  const {setUser,setIsAuthenticated,setBlogs}=useContext(Context)
  useEffect(()=>{
    setIsAuthenticated(false)
    setUser(null)
    setBlogs(null)
    navigate('/')
    
  },[navigate])
  return (
    <>  
    <Navbar/>
    <Outlet />
    <Footer/>
    <Toaster/>
    </>
  )
}

export default App
