import express from "express"
import { createSubscriber,deleteSubscriber,getAllUserSubscriberInfo,getUserSubscribedAuthorBlogs } from "../controllers/subscriber.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router=express.Router()

router.route('/newSubscriber/:id').post(verifyJWT,createSubscriber)
router.route('/deleteSubscriber/:id').delete(verifyJWT,deleteSubscriber)
router.route('/allSubscribedAuhtorInfo').get(verifyJWT,getAllUserSubscriberInfo)
router.route('/getUserSubscribedAuthorBlogs').get(verifyJWT,getUserSubscribedAuthorBlogs)


export {router}