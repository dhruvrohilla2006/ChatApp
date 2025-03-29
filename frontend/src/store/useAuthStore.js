import { create } from "zustand";
import { axiosInstance } from "../libs/Axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:8080";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false, // ✅ Fixed typo
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      console.log("auth user => ", get().authUser); // ✅ Logs updated user
      get().connectsocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectsocket();
      toast.success("Account Created Successfully");
    } catch (error) {
      console.log("Error While Signing Up", error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true }); // ✅ Fixed typo
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data });
      console.log("Logged in user:", get().authUser); // ✅ Logs updated user
      toast.success("Logged In Successfully");
      get().connectsocket();
    } catch (error) {
      toast.error("Invalid Credentials");
      console.log("Login Error:", error.response);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectsocket();
      toast.success("Logged Out Successfully");
    } catch (error) {
      console.log(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log("Profile Update Error:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectsocket: async () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    console.log("Auth User", authUser);
    console.log(
      "🔹 Attempting Socket Connection with UserID:",
      await authUser._id
    );

    const socket = io(BASE_URL, {
      query: { userId: authUser?._id }, // Ensure this exists
    });

    set({ socket: socket });

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);
    });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("🟢 Online Users List Updated:", userIds);
      set({ onlineUsers: [...userIds] });
    });
  },

  disconnectsocket: async () => {
    get().socket?.disconnect(); // ✅ Prevents crash if socket is null
  },
}));
