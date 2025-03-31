import express from "express"
import { createSubscriber,deleteSubscriber,getAllUserSubscriberInfo } from "../controllers/subscriber.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router=express.Router()

router.route('/newSubscriber/:id').post(verifyJWT,createSubscriber)
router.route('/deleteSubscriber/:id').delete(verifyJWT,deleteSubscriber)
router.route('/allSubscrubedAuhtorInfo').get(verifyJWT,getAllUserSubscriberInfo)

export {router}