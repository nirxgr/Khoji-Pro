import userModel from "../models/userModel.js";

export const completeProfile = async (req, res) => {
  try {
    const { location, profession, phoneNumber, bio, linkedinId, githubId } =
      req.body;

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.location = location;
    user.profession = profession;
    user.phoneNumber = phoneNumber;
    user.bio = bio;
    if (linkedinId && linkedinId.trim() !== "") {
      user.linkedinId = linkedinId;
    }
    if (githubId && githubId.trim() !== "") {
      user.githubId = githubId;
    }
    user.profileStatus = "Completed";

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Profile completed!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
