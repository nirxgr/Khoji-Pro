import userModel from "../models/userModel.js";
import skillModel from "../models/skillSchema.js";

export const getSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const skills = await skillModel
      .find({ user: id })
      .populate("company", "company");

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, company } = req.body;

    const existingSkill = await skillModel.findOne({
      user: userId,
      name: name.trim(),
    });
    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: `Skill "${name}" already exists for this user.`,
      });
    }

    const newSkill = await skillModel.create({
      user: userId,
      name,
      company: company || null,
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { skills: newSkill._id },
    });

    return res.status(201).json({
      success: true,
      message: "New Skill Added!",
      skill: newSkill,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { name, companyId } = req.body;
    const userId = req.user.id;
    const skill = await skillModel.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (name) {
      const existingSkill = await skillModel.findOne({
        user: userId,
        name: name.trim(),
        _id: { $ne: skill._id }, // exclude the current skill
      });
      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: `Skill "${name}" already exists for this user.`,
        });
      }
      skill.name = name.trim();
    }
    if (companyId !== undefined) skill.company = companyId || null;

    await skill.save();

    return res.status(200).json({
      success: true,
      message: "Skills Updated!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const userId = req.user.id;

    const skill = await skillModel.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await userModel.findByIdAndUpdate(userId, {
      $pull: { skills: skill._id },
    });

    await skill.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Skill Deleted Successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
