import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getProfile, getUserData, searchUsers } from '../controllers/userController.js';
import { deleteProfilePic, uploadProfilePic } from '../controllers/profile-picture.controller.js';
import { upload } from "../middleware/image-uploader.middleware.js"


const userRouter = express.Router();

userRouter.get('/data',userAuth, getUserData);
userRouter.get('/search',userAuth, searchUsers);
userRouter.get('/:id',userAuth,getProfile)
userRouter.patch('/updateProfilePic',userAuth,upload.single('image'), uploadProfilePic)
userRouter.delete('/deleteProfilePic',userAuth, deleteProfilePic)




export default userRouter;