import jwt from "jsonwebtoken";
import User from "../modals/User.modal.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ msg: "Unathorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ msg: "Unathorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "Unathorized - User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protected route middleware", error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
