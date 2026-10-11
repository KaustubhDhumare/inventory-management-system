import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import ROLES from "../constants/roles.js";
import { ASSIGNABLE_EMPLOYEE_PERMISSIONS, EMPLOYEE_DEFAULT_PERMISSIONS } from "../constants/permissions.js";
import jwt from "jsonwebtoken"

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
      enum: Object.values(ROLES),
      default: "employee",
    },

    permissions: {
      type: [{ type: String, enum: ASSIGNABLE_EMPLOYEE_PERMISSIONS }],
      default: () => [...EMPLOYEE_DEFAULT_PERMISSIONS],
    },

    authVersion: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateAccessToken = function (){
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      authVersion: this.authVersion || 0,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    }
  )
}

userSchema.methods.generateRefreshToken = function (){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    }
  )
}

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
