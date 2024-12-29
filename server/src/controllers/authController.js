import User from "../models/userSchema.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customErrorClass.js";
import generateToken from "../utils/jwtToken.js";


// Register user
export const registerUser = asyncErrorHandler(async (req, res, next) => {

    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });

    if (userExists) {
      const error = new CustomError("User already exists with this email", 400);
      return next(error);
    }

    const user = await User.create({
      email,
      password: password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove the password before sending the response
    user.password = undefined;

    // Send token in a cookie
    res.cookie("auth_token", token, { httpOnly: true, maxAge: 3600000 }).status(201).json({
        success: true,
        message: "User sign up successfully",
        token,
        user
      });
});


// Login user
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new CustomError("Invalid credentials", 400);
    return next(error);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new CustomError("Invalid credentials", 400);
    return next(error);
  }

  // Generate token
  const token = generateToken(user._id);

  // Remove the password before sending the response
  user.password = undefined;

  // Send token in a cookie
  res.cookie("auth_token", token, { httpOnly: true, maxAge: 3600000 }).status(200).json({ 
    success: true,
    message: "Login successful",
    user
  });
   
});



// Load User
export const loadUser = asyncErrorHandler(async (req, res, next) => {
  const activeUser = req.user;

  // Remove the password before sending the response
  activeUser.password = undefined;

  if (!activeUser) {
    res.status(401).json({
      success: false,
      message: "token expire! please login",
    });
  } else {
    res.status(200).json({
      success: true,
      user: activeUser,
    });
  }
});



// LOG OUT USER
export const logOutUser = asyncErrorHandler(async (req, res, next) => {

  res.clearCookie("auth_token", {
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "logout successfully",
    });
});
