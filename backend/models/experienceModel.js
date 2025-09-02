import { Schema, model, Types } from "mongoose";

const experienceSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Self-employed",
        "Freelance",
        "Contract",
        "Internship",
      ],
    },
  },
  { timestamps: true }
);

const experienceModel = model("Experience", experienceSchema);

export default experienceModel;
