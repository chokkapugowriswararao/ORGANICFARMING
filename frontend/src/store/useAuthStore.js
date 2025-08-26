import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
checkAuth: async () => {
  try {
    const res = await axiosInstance.get("/auth/check", {
      withCredentials: true,
    });

    if (!res.data.isApproved) {
      toast.error("Account awaiting admin approval.");
      set({ authUser: null });
    } else {
      set({ authUser: res.data });
    }
  } catch (error) {
    console.log("error in checkAuth:", error);
    set({ authUser: null });
  } finally {
    set({ isCheckingAuth: false });
  }
},



  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/auth/signup", data);
      toast.success("Account created! Awaiting admin approval.");
      // ✅ Do NOT set authUser or navigate
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (!res.data.isApproved) {
        toast.error("Your account is awaiting admin approval.");
        set({ authUser: null });
      } else {
        set({ authUser: res.data });
        toast.success("Logged in successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },
}));
