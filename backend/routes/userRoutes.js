import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getProfile,
  getLoggedinUserData,
  searchUsers,
  getAllUsers,
} from "../controllers/userController.js";
import {
  deleteProfilePic,
  uploadProfilePic,
} from "../controllers/profile-picture.controller.js";
import { upload } from "../middleware/image-uploader.middleware.js";
import {
  deleteCoverPic,
  uploadCoverPic,
} from "../controllers/cover-picture.controller.js";
import {
  deleteGithubId,
  deleteLinkedinId,
} from "../controllers/deleteController.js";

function multerErrorHandler(req, res, next) {
  upload.single("image")(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ success: false, message: "File too large (max 1MB)" });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}

const userRouter = express.Router();

userRouter.get("/data", userAuth, getLoggedinUserData);
userRouter.get("/search", userAuth, searchUsers);
userRouter.get("/getAllUsers", userAuth, getAllUsers);
userRouter.get("/:id", userAuth, getProfile);
userRouter.patch(
  "/updateProfilePic",
  userAuth,
  multerErrorHandler,
  uploadProfilePic
);
userRouter.delete("/deleteProfilePic", userAuth, deleteProfilePic);
userRouter.patch(
  "/updateCoverPic",
  userAuth,
  multerErrorHandler,
  uploadCoverPic
);
userRouter.delete("/deleteCoverPic", userAuth, deleteCoverPic);
userRouter.delete("/deleteLinkedinId", userAuth, deleteLinkedinId);
userRouter.delete("/deleteGithubId", userAuth, deleteGithubId);

export default userRouter;
