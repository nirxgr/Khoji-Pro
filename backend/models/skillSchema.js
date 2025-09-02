import { Schema, model, Types } from "mongoose";

const skillSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: Types.ObjectId,
      ref: "Experience",
      default: null,
    },
  },
  { timestamps: true }
);

const skillModel = model("Skill", skillSchema);
export default skillModel;
