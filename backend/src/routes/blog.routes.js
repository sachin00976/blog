import express from 'express'
import { blogPost,deleteBlog,getAllBlogs,getSingleBlog,updateBlog } from '../controllers/blog.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { roleAuth } from '../middlewares/roleAuth.middleware.js'
const router=express.Router()

router.route('/post').post(verifyJWT,roleAuth("Author"),blogPost)
router.route('/deletePost/:id').delete(verifyJWT,roleAuth("Author"),deleteBlog)
router.route('/getAllBlog').get(getAllBlogs)
router.route('/singleBlog/:id').get(getSingleBlog)
router.route('/update/:id').put(verifyJWT,roleAuth("Author"),updateBlog)

export {router}

