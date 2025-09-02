import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  addEducation,
  deleteEducation,
  getEducation,
  updateEducation,
} from "../controllers/educationController.js";

const educationRouter = express.Router();

educationRouter.get("/get-education/:id", userAuth, getEducation);
educationRouter.post("/add-education", userAuth, addEducation);
educationRouter.put("/update-education/:id", userAuth, updateEducation);
educationRouter.delete("/delete-education/:id", userAuth, deleteEducation);

export default educationRouter;
