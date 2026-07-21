import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      index: true,
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [50, "Category name must be at most 50 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description must be at most 300 characters long"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
