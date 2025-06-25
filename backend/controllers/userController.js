import { encryptPassword, matchPassword } from "../helper/userHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "All feilds are required" });
    }
    // checking user email already exist

    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res
        .status(400)
        .send({ success: false, message: "Email already exist" });
    }
    //  encrypting user password

    const hashedPassword = await encryptPassword(password);

    // creating new user

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    return res
      .status(201)
      .send({ success: true, message: "User registeration successful" });
  } catch (error) {
    console.log(`registerController Error ${error}`);
    return res
      .status(400)
      .send({ success: false, message: "error in register controller", error });
  }
};
const loginController = async (req, res) => {
  // Validation
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "All feilds are required" });
    }
    // check user email is present or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Email not registered" });
    }
    // matching password
    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect Email/Password" });
    }
    // Remove password feild to send user data from backend to frontend
    user.password = undefined;
    // generating token
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });
    // return success response
    return res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .send({ success: true, message: "Login successful", user, token });
  } catch (error) {
    console.log(`registerController Error ${error}`);
    return res
      .status(400)
      .send({ success: false, message: "error in register controller", error });
  }
};
const logoutController = async (req, res) => {
  return res
    .cookie("token", "", { httpOnly: true, secure: true, expires: new Date(0) }) // to remove cookies from browser cookies
    .status(200)
    .send({ success: true, message: "Logout successfully" });
};
const allUsersController = async (req, res) => {
  try {
    // Find all users in database
    const users = await userModel.find({}).select("-password");
    if (!users) {
      return res.status(404).send({ success: false, message: "No user found" });
    }
    // return success response
    return res.status(200).send({ success: true, total: users.length, users });
  } catch (error) {
    console.log(`allUsersController Error ${error}`);
    return res
      .status(400)
      .send({ success: false, message: "error in allUsersController", error });
  }
};
const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    if (!email || typeof role === "undefined") {
      return res
        .status(400)
        .send({ success: false, message: "Email and role are required" });
    }
    const userToUpdate = await userModel.findById(id);
    if (!userToUpdate) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    // Prevent demoting the last admin
    if (userToUpdate.role === 1 && role != 1) {
      const adminCount = await userModel.countDocuments({ role: 1 });
      if (adminCount === 1) {
        return res.status(400).send({ success: false, message: "Cannot demote the last admin user." });
      }
    }
    userToUpdate.email = email;
    userToUpdate.role = role;
    await userToUpdate.save();
    const updatedUser = await userModel.findById(id).select("-password");
    return res.status(200).send({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.log(`updateUserController Error ${error}`);
    return res.status(400).send({ success: false, message: "Error updating user", error });
  }
};
const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await userModel.findById(id);
    if (!userToDelete) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    // Prevent deleting the last admin
    if (userToDelete.role === 1) {
      const adminCount = await userModel.countDocuments({ role: 1 });
      if (adminCount === 1) {
        return res.status(400).send({ success: false, message: "Cannot delete the last admin user." });
      }
    }
    await userModel.findByIdAndDelete(id);
    return res.status(200).send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(`deleteUserController Error ${error}`);
    return res.status(400).send({ success: false, message: "Error deleting user", error });
  }
};

export {
  registerController,
  loginController,
  logoutController,
  allUsersController,
  updateUserController,
  deleteUserController,
};
