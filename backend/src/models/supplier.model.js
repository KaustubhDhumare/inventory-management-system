import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Supplier name is required"],
      unique: true,
      trim: true,
      index: true,
      minlength: [3, "Supplier name must be at least 3 characters long"],
      maxlength: [50, "Supplier name must be at most 50 characters long"],
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [50, "Contact person name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phoneNo: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, "Address must be at most 300 characters long"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
