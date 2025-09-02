import userModel from "../models/userModel.js";

export const deleteLinkedinId = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.linkedinId = "";
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "LinkedIn ID deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGithubId = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.githubId = "";
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Github ID deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
