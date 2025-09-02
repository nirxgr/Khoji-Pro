import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  addExperience,
  updateExperience,
  deleteExperience,
  getExperience,
} from "../controllers/experienceController.js";

const experienceRouter = express.Router();

experienceRouter.get("/get-experience/:id", userAuth, getExperience);
experienceRouter.post("/add-experience", userAuth, addExperience);
experienceRouter.put("/update-experience/:id", userAuth, updateExperience);
experienceRouter.delete("/delete-experience/:id", userAuth, deleteExperience);

export default experienceRouter;
