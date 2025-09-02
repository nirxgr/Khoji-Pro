import userModel from "../models/userModel.js";

export const getFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userModel.findById(id).populate({
      path: "favorites",
      select:
        "firstName lastName email _id bio profession location skills profilePictureUrl",
      populate: {
        path: "skills",
        select: "name -_id",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteUserId } = req.body;

    if (!favoriteUserId) {
      return res.status(400).json({ message: "Favorite User ID is required" });
    }

    if (userId === favoriteUserId) {
      return res.status(400).json({ message: "You cannot favorite yourself" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favorites.includes(favoriteUserId)) {
      user.favorites.push(favoriteUserId);
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "User added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteUserId } = req.body;

    if (!favoriteUserId) {
      return res.status(400).json({ message: "Favorite User ID is required" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== favoriteUserId
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
