import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  addSkill,
  deleteSkill,
  getSkill,
  updateSkill,
} from "../controllers/skillController.js";

const skillRouter = express.Router();

skillRouter.get("/get-skill/:id", userAuth, getSkill);
skillRouter.post("/add-skill", userAuth, addSkill);
skillRouter.put("/update-skill/:id", userAuth, updateSkill);
skillRouter.delete("/delete-skill/:id", userAuth, deleteSkill);

export default skillRouter;
