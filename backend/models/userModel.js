import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: function() {
        return !this.googleId; // Phone is required only if not using Google OAuth
      },
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Password is required only if not using Google OAuth
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      default: "", // URL or base64 string
    },
    role: {
      type: Number,
      default: 0, //0 means user
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
