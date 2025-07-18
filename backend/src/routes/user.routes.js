import express from 'express'
import { login, register,logout,getMyProfile,getAllAuthors,getAllUserBlog,getUserProfile,googleAuth,updateUserProfile
    ,mostSubscribedAuthor, getCurrentUser
 } from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { roleAuth } from '../middlewares/roleAuth.middleware.js';
const router=express.Router();

router.route('/me').get(verifyJWT, getCurrentUser)
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/googleLogin').post(googleAuth)
router.route('/googleRegister').post(googleAuth)
router.route('/logout').get(verifyJWT,logout)
router.route('/myProfile').get(verifyJWT,getMyProfile)
router.route('/userProfile/:id').get(verifyJWT,getUserProfile)
router.route('/authors').get(getAllAuthors)
router.route('/allUserBlog').get(verifyJWT,getAllUserBlog)
router.route('/updateUserProfile').patch(verifyJWT,updateUserProfile)
router.route("/mostSubsAuthor").get(mostSubscribedAuthor)



export {router};