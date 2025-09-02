import User from "../models/userModel.js";
import { uploadBufferToCloudinary } from "../middleware/image-uploader.middleware.js";
import cloudinary from "../config/cloudinary.config.js";

export async function uploadProfilePic(req, res) {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "profilepic",
      public_id: `user_${req.user.id}`,
      transformation: [
        { width: 1600, height: 1600, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    //save image details to MongoDb
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePictureUrl: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      image: user.profilePictureUrl,
      message: "Profile picture updated successfully!",
    });
  } catch (e) {
    if (e.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ success: false, message: "File too large (max 5MB)" });
    }
    if (e.message?.includes("Only JPG, JPEG, PNG")) {
      return res.status(400).json({ success: false, message: e.message });
    }
    res
      .status(500)
      .json({ success: false, message: e.message || "Upload failed" });
  }
}

export async function deleteProfilePic(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.profilePictureUrl.url || !user.profilePictureUrl.public_id) {
      return res
        .status(400)
        .json({ success: false, message: "No profile picture to delete" });
    }

    await cloudinary.uploader.destroy(user.profilePictureUrl.public_id);

    user.profilePictureUrl = { url: "", public_id: "" };
    await user.save();

    return res.json({
      success: true,
      message: "Profile picture deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
