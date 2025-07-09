import express from "express";
import {
  allUsersController,
  loginController,
  logoutController,
  registerController,
  updateUserController,
  deleteUserController,
} from "../controllers/userController.js";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { uploadImageOnCloudinary } from "../helper/cloudinaryHelper.js";

const userRouter = express.Router();

// http://localhost:8080/api/v1/users/register

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/logout", logoutController);
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
    
    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      picture: result.secure_url
    });
  } catch (error) {
    console.log("Profile picture upload error:", error);
    res.status(500).json({ success: false, message: "Error uploading profile picture" });
  }
});

// Admin Routes

userRouter.get("/all-users", isAuthorized, isAdmin, allUsersController);

export default userRouter;