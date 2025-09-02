import userModel from "../models/userModel.js";
export async function updateCoverPicture(req, res) {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.coverPictureUrl = req.body.imageUrl;
    await user.save();

    return res.json({
      success: true,
      message: "Cover picture updated successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
export async function updateProfilePicture(req, res) {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePictureUrl = req.body.imageUrl;
    await user.save();

    return res.json({
      success: true,
      message: "Profile picture updated successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
export async function updateProfileDetails(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.profession = req.body.profession || user.profession;
    user.location = req.body.location || user.location;
    user.bio = req.body.bio || user.bio;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.linkedinId = req.body.linkedinId || user.linkedinId;
    user.githubId = req.body.githubId || user.githubId;
    await user.save();

    return res.json({
      success: true,
      message: "Profile details updated successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
