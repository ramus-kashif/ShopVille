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

const userRouter = express.Router();

// http://localhost:8080/api/v1/users/register

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/logout", logoutController);
userRouter.put("/:id", isAuthorized, isAdmin, updateUserController);
userRouter.delete("/:id", isAuthorized, isAdmin, deleteUserController);

// Admin Routes

userRouter.get("/all-users", isAuthorized, isAdmin, allUsersController);

export default userRouter;