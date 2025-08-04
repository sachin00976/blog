import React from 'react'
import {CreateBlog} from '../miniComponents/index'
import { Helmet } from 'react-helmet-async'
function Blogs() {
  return (
    <>
      <Helmet>
        <title>{`Create blog - ${import.meta.env.VITE_APP_NAME}`}</title>
      </Helmet>
      <CreateBlog/>
    </>
  )
}

export default Blogs
