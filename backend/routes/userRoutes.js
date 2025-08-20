import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getProfile, getUserData, searchUsers } from '../controllers/userController.js';
import { deleteProfilePic, uploadProfilePic } from '../controllers/profile-picture.controller.js';
import { upload } from "../middleware/image-uploader.middleware.js"
import { deleteCoverPic, uploadCoverPic } from '../controllers/cover-picture.controller.js';
import { deleteGithubId, deleteLinkedinId } from '../controllers/deleteController.js';


const userRouter = express.Router();

userRouter.get('/data',userAuth, getUserData);
userRouter.get('/search',userAuth, searchUsers);
userRouter.get('/:id',userAuth,getProfile)
userRouter.patch('/updateProfilePic',userAuth,upload.single('image'), uploadProfilePic)
userRouter.delete('/deleteProfilePic',userAuth, deleteProfilePic)
userRouter.patch('/updateCoverPic',userAuth,upload.single('image'), uploadCoverPic)
userRouter.delete('/deleteCoverPic',userAuth, deleteCoverPic)
userRouter.delete('/deleteLinkedinId',userAuth,deleteLinkedinId)
userRouter.delete('/deleteGithubId',userAuth,deleteGithubId)




export default userRouter;