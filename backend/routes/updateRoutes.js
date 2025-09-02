import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  updateCoverPicture,
  updateProfileDetails,
  updateProfilePicture,
} from "../controllers/updateController.js";
import { completeProfile } from "../controllers/completeProfileController.js";

const updateRouter = express.Router();

updateRouter.post("/completeProfile", userAuth, completeProfile);
updateRouter.post("/updateProfilePic", userAuth, updateProfilePicture);
updateRouter.post("/updateCoverPic", userAuth, updateCoverPicture);
updateRouter.post("/updateProfileDetails", userAuth, updateProfileDetails);

export default updateRouter;
