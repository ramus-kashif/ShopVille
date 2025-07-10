import { encryptPassword, matchPassword } from "../helper/userHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    // For phone-only registration, email is not required
    if (!name || !password || (!email && !phone)) {
      return res
        .status(400)
        .send({ success: false, message: "Name, password, and either email or phone are required" });
    }
    
    // If email is provided, check if it already exists
    if (email) {
      const isExist = await userModel.findOne({ email });
      if (isExist) {
        return res
          .status(400)
          .send({ success: false, message: "Email already exist" });
      }
    }

    //  encrypting user password
    const hashedPassword = await encryptPassword(password);

    // creating new user
    const userData = {
      name,
      password: hashedPassword,
    };

    // Add email if provided
    if (email) {
      userData.email = email;
    }

    // Add role if provided (for admin user creation)
    if (role !== undefined) {
      userData.role = role;
    }

    // Add phone if provided
    if (phone && phone.trim() !== '') {
      // Format phone number: remove all non-digits and ensure it's 10 digits
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        return res
          .status(400)
          .send({ success: false, message: "Phone number must be exactly 10 digits" });
      }
      
      // Format as 3XX-XXXXXXX
      const formattedPhone = cleanPhone.slice(0, 3) + '-' + cleanPhone.slice(3);
      
      const existingUserWithPhone = await userModel.findOne({ phone: formattedPhone });
      if (existingUserWithPhone) {
        return res
          .status(400)
          .send({ success: false, message: "Phone number already exists" });
      }
      
      userData.phone = formattedPhone;
    }

    const newUser = await userModel.create(userData);
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
    
    // Prevent admin from logging into user side
    if (user.role === 1) {
      return res
        .status(403)
        .send({ success: false, message: "Admins must use the admin panel to login" });
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
    console.log("=== UPDATE USER DEBUG START ===");
    console.log("1. Request params:", req.params);
    console.log("2. Request body:", req.body);
    
    const { id } = req.params;
    const { name, email, picture, password, role, phone } = req.body;
    
    console.log("3. Extracted data:", { name, email, picture, password, role, phone });
    
    const userToUpdate = await userModel.findById(id);
    if (!userToUpdate) {
      console.log("4. User not found");
      return res.status(404).send({ success: false, message: "User not found" });
    }
    
    console.log("5. Found user:", userToUpdate);
    
    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email;
    if (typeof picture !== 'undefined') userToUpdate.picture = picture;
    if (password) {
      userToUpdate.password = await encryptPassword(password);
    }
    if (role !== undefined) userToUpdate.role = role;
    
    // Handle phone field update
    if (phone !== undefined) {
      // If phone is provided and not empty, check for uniqueness
      if (phone && phone.trim() !== '') {
        // Format phone number: remove all non-digits and ensure it's 10 digits
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
          return res.status(400).send({ success: false, message: "Phone number must be exactly 10 digits" });
        }
        
        // Format as 3XX-XXXXXXX
        const formattedPhone = cleanPhone.slice(0, 3) + '-' + cleanPhone.slice(3);
        
        const existingUserWithPhone = await userModel.findOne({ phone: formattedPhone, _id: { $ne: id } });
        if (existingUserWithPhone) {
          return res.status(400).send({ success: false, message: "Phone number already exists" });
        }
        userToUpdate.phone = formattedPhone;
      } else {
        // If phone is empty or null, remove it (since it's not required for non-Google users)
        userToUpdate.phone = undefined;
      }
    }
    
    console.log("6. Updated user data:", userToUpdate);
    
    await userToUpdate.save();
    const updatedUser = await userModel.findById(id).select("-password");
    
    console.log("7. User saved successfully");
    console.log("=== UPDATE USER DEBUG END ===");
    
    return res.status(200).send({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("=== UPDATE USER ERROR ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    return res.status(400).send({ success: false, message: "Error updating user", error: error.message });
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
const adminLoginController = async (req, res) => {
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
    
    // Only allow admins to login
    if (user.role !== 1) {
      return res
        .status(403)
        .send({ success: false, message: "Access denied. Admin privileges required." });
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
      .send({ success: true, message: "Admin login successful", user, token });
  } catch (error) {
    console.log(`adminLoginController Error ${error}`);
    return res
      .status(400)
      .send({ success: false, message: "error in admin login controller", error });
  }
};

export {
  registerController,
  loginController,
  adminLoginController,
  logoutController,
  allUsersController,
  updateUserController,
  deleteUserController,
};
