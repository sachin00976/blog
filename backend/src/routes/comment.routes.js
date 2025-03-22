import express from "express"
import {createComment,getAllBlogComments,editComment,deleteComment} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router=express.Router()
router.route("/newComment/:blogId").post(verifyJWT,createComment)
router.route("/getComment/:blogId").post(verifyJWT,getAllBlogComments)
router.route("/editComment/:commentId/:blogId").post(verifyJWT,editComment)
router.route("/deleteComment/:commentId/:blogId").post(verifyJWT,deleteCommentY)
export {router}
