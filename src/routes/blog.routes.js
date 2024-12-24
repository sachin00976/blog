import express from 'express'
import { blogPost,deleteBlog } from '../controllers/blog.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { roleAuth } from '../middlewares/roleAuth.middleware.js'
const router=express.Router()

router.route('/post').post(verifyJWT,roleAuth("Author"),blogPost)
router.route('/deletePost/:id').delete(verifyJWT,roleAuth("Author"),deleteBlog)

export {router}

