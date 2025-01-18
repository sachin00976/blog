import { createContext,useState } from "react"
import Router from './Router'
import { RouterProvider } from 'react-router-dom'
import App from './App.jsx'

const Context=createContext({
    isAuthenticated:false,
    
})

const AppWrapper=()=>{
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [user,setUser]=useState({})
    const [blogs,setBlogs]=useState([])
    const [mode,setMode]=useState("dark")


    return (
        <Context.Provider
        value={{
            user,
            setUser,
            isAuthenticated,
            setIsAuthenticated,
            blogs,
            setBlogs,
            mode,
            setMode
        }}
        >
            <RouterProvider router={Router}/>
            
        </Context.Provider>
    )
}
export {Context,AppWrapper}