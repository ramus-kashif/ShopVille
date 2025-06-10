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

export {
  registerController,
  loginController,
  logoutController,
  allUsersController,
};
