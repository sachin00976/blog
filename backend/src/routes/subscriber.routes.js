import express from "express"
import { createSubscriber,deleteSubscriber } from "../controllers/subscriber.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router=express.Router()

router.route('/newSubscriber/:id').post(verifyJWT,createSubscriber)
router.route('/deleteSubscriber/:id').delete(verifyJWT,deleteSubscriber)

export {router}