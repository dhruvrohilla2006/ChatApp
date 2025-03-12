import User from "../modals/user.modal.js";
import { generateToken } from "../libs/utils.js";
import bycrpt from "bcryptjs";

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

    const salt = await bycrpt.genSalt(10);
    const hashedPassword = await bycrpt.hash(password, salt);

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
          user: newUser,
        },
      });
    } else {
      return res.status(400).json({ message: "Failed to create new user" });
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
    const isMatch = await bycrpt.compare(password, user.password);

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
        token,
      },
    });
  } catch (error) {
    console.log({ "Error in login controller": error.message });
  }
};

export const logout = async (req, res) => {
  const { email, password } = req.body;
  res.status(200).send({ email: email, password: password });
};
