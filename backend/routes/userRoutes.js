import express from "express";
import {
  allUsersController,
  loginController,
  adminLoginController,
  logoutController,
  registerController,
  updateUserController,
  deleteUserController,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/userController.js";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { uploadImageOnCloudinary } from "../helper/cloudinaryHelper.js";

const userRouter = express.Router();

// http://localhost:8080/api/v1/users/register

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.post("/admin/login", adminLoginController);
userRouter.post("/logout", logoutController);
userRouter.patch("/:id", isAuthorized, updateUserController);
userRouter.put("/:id", isAuthorized, isAdmin, updateUserController);
userRouter.delete("/:id", isAuthorized, isAdmin, deleteUserController);

// Upload profile picture
userRouter.post("/upload-profile-picture", isAuthorized, upload.single("picture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await uploadImageOnCloudinary(req.file.path, "profile-pictures");
    // Update the user's picture field in the database
    const userId = req.user._id || req.user.id;
    await import("../models/userModel.js").then(async ({ default: userModel }) => {
      await userModel.findByIdAndUpdate(userId, { picture: result.secure_url });
    });
    // Fetch the updated user (without password)
    const updatedUser = await import("../models/userModel.js").then(async ({ default: userModel }) => {
      return userModel.findById(userId).select("-password");
    });
    res.status(200).json({
      success: true,
      message: "Profile picture uploaded and updated successfully",
      picture: result.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Profile picture upload error:", error);
    res.status(500).json({ success: false, message: "Error uploading profile picture" });
  }
});

// Wishlist endpoints
userRouter.post("/wishlist/add", isAuthorized, addToWishlist);
userRouter.post("/wishlist/remove", isAuthorized, removeFromWishlist);
userRouter.get("/wishlist", isAuthorized, getWishlist);

// Admin Routes

userRouter.get("/all-users", isAuthorized, isAdmin, allUsersController);

export default userRouter;