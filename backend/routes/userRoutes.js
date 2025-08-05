import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getProfile, getUserData, searchUsers } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/data',userAuth, getUserData);
userRouter.get('/search',userAuth, searchUsers);
userRouter.get('/:id',userAuth,getProfile)




export default userRouter;