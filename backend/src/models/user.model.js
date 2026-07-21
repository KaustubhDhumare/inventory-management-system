import mongoose, { STATES } from "mongoose";
import bycrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be atleast 8 characters long"],
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
