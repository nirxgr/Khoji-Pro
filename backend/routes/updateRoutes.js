import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { updateCoverPicture, updateProfilePicture } from '../controllers/updateController.js';


const updateRouter = express.Router();

updateRouter.post('/updateProfilePic',userAuth, updateProfilePicture);
updateRouter.post('/updateCoverPic',userAuth, updateCoverPicture);



export default updateRouter;