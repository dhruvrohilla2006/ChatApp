import User from "../modals/user.modal.js";
import { generateToken } from "../libs/utils.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        data: {
          message: "User created successfully",
          User: newUser,
        },
      });
    } else {
      return res.status(400).json({ message: "Failed to create new User" });
    }
  } catch (error) {
    console.log("Error in signup Controller", error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "Invalid Credential",
      });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(404).json({
        message: "Invalid Credential",
      });
    const token = generateToken(user._id, res);
    res.status(200).json({
      data: {
        message: "User logged in successfully",
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        _id: user._id,
        token,
      },
    });
  } catch (error) {
    console.log({ "Error in login controller": error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User Logged out Successfull" });
  } catch (error) {
    console.log({ "Error in logout controller": error.message });
    res.status(400).json({
      message: "Failed to logout user",
    });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!req.imageUrl) {
      return res.status(400).send("No file uploaded.");
    }
    const fileUrl = req.imageUrl;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        email,
        profilePic: fileUrl,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      data: {
        message: "User Profile Updated Successfully",
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send("Error uploading file.");
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(400).json({
      message: "Failed to check User authentication",
    });
  }
};
