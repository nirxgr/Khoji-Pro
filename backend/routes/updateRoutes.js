import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { updateCoverPicture, updateProfileDetails, updateProfilePicture } from '../controllers/updateController.js';


const updateRouter = express.Router();

updateRouter.post('/updateProfilePic',userAuth, updateProfilePicture);
updateRouter.post('/updateCoverPic',userAuth, updateCoverPicture);
updateRouter.post('/updateProfileDetails',userAuth, updateProfileDetails);



export default updateRouter;