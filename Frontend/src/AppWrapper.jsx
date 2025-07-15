import { createContext, useEffect, useState } from "react";
import Router from './Router';
import { RouterProvider } from 'react-router-dom';

const Context = createContext({
  isAuthenticated: false,
  user: null,
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const val = localStorage.getItem('user');
    if (val) {
        console.log("user:",val)
      setUser(JSON.parse(val));
      setIsAuthenticated(true);  
    }
  }, []);

  return (
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
  );
};

export { Context, AppWrapper };
