import express from "express";
import userAuth from "../middleware/userAuth.js";
import { professionalCount } from "../controllers/profiessionalController.js";

const professionRouter = express.Router();

professionRouter.get("/getProfessionalCount/", userAuth, professionalCount);

export default professionRouter;
