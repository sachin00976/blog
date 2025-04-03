import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Home, Register, Login, Blogs, SingleBlog, About, AllAuthors, Dashboard, UpdateBlog,UserProfile,EditProfile } from "./components/pages/index";
import App from "./App";
import Followings from "./components/pages/Following";

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="blog/:id" element={<SingleBlog />} />
      <Route path="about" element={<About />} />
      <Route path="authors" element={<AllAuthors />} />
      <Route path="dashboard" element={<Dashboard />}/>  
      <Route path="editProfile" element={<EditProfile/>}/>
      <Route path="blog/update/:id" element={<UpdateBlog />} />
      <Route path="blog/userProfile/:id" element={<UserProfile />} />
      <Route path="followings" element={<Followings />} />
    </Route>
  )
);

export default Router;
