import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  addFavorites,
  getFavorites,
  removeFavorites,
} from "../controllers/favoritesController.js";

const favoritesRouter = express.Router();

favoritesRouter.get("/get-favorites/:id", userAuth, getFavorites);
favoritesRouter.post("/add-favorites", userAuth, addFavorites);
favoritesRouter.delete("/delete-favorites", userAuth, removeFavorites);

export default favoritesRouter;
