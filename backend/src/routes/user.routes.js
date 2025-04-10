import express from 'express'
import { login, register,logout,getMyProfile,getAllAuthors,getAllUserBlog,getUserProfile,googleRegister,googleLogin,updateUserProfile } from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { roleAuth } from '../middlewares/roleAuth.middleware.js';
const router=express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/googleLogin').post(googleLogin)
router.route('/googleRegister').post(googleRegister)
router.route('/logout').get(verifyJWT,logout)
router.route('/myProfile').get(verifyJWT,getMyProfile)
router.route('/userProfile/:id').get(verifyJWT,getUserProfile)
router.route('/authors').get(getAllAuthors)
router.route('/allUserBlog').get(verifyJWT,getAllUserBlog)
router.route('/updateUserProfile').patch(verifyJWT,updateUserProfile)


export {router};