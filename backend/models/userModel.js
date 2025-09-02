import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
    profileStatus: {
      type: String,
      enum: ["Incomplete", "Completed"],
      default: "Incomplete",
    },

    profilePictureUrl: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
        default: "profilepic/default",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },

    coverPictureUrl: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
        default: "profilepic/default",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    skills: [
      {
        type: Types.ObjectId,
        ref: "Skill",
      },
    ],
    profession: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedinId: { type: String, default: "" },
    githubId: { type: String, default: "" },
    bio: { type: String, default: "" },
    experiences: [
      {
        type: Types.ObjectId,
        ref: "Experience",
      },
    ],
    educations: [
      {
        type: Types.ObjectId,
        ref: "Education",
      },
    ],
    favorites: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

//IF USER MODEL EXISTS IT USES THIS OR CREATES NEW ONE
const userModel = mongoose.models.user || mongoose.model("User", userSchema);
export default userModel;
