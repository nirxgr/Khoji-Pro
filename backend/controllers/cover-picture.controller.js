import User from "../models/userModel.js";
import { uploadBufferToCloudinary } from "../middleware/image-uploader.middleware.js";
import cloudinary from "../config/cloudinary.config.js";

export async function uploadCoverPic(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "coverpic",
      public_id: `user_${req.user.id}`,
      transformation: [
        { width: 1600, height: 600, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    //save image details to MongoDb
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        coverPictureUrl: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      image: user.coverPictureUrl,
      message: "Cover picture updated successfully!",
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

export async function deleteCoverPic(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.coverPictureUrl.url || !user.coverPictureUrl.public_id) {
      return res
        .status(400)
        .json({ success: false, message: "No cover picture to delete" });
    }

    await cloudinary.uploader.destroy(user.coverPictureUrl.public_id);

    user.coverPictureUrl = { url: "", public_id: "" };
    await user.save();

    return res.json({
      success: true,
      message: "Cover picture deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
