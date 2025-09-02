import educationModel from "../models/educationModel.js";
import userModel from "../models/userModel.js";

export const getEducation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const educations = await educationModel
      .find({ user: id })
      .sort({ startDate: -1 });

    res.status(200).json(educations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      activities,
    } = req.body;

    const newEducation = await educationModel.create({
      user: userId,
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      activities,
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { educations: newEducation._id },
    });

    return res.status(201).json({
      success: true,
      message: "New Education Added!",
      education: newEducation,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await educationModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Education Not Found!" });
    }

    return res.status(200).json({
      success: true,
      message: "Education Updated!",
      education: updated,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const exp = await educationModel.findOne({ _id: id, user: userId });
    if (!exp) {
      return res.status(404).json({ message: "Experience Not Found!" });
    }

    await educationModel.findByIdAndDelete(id);
    await userModel.findByIdAndUpdate(userId, {
      $pull: { educations: id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Education Deleted Successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
