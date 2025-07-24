import express from "express";
import { adminLogin } from "../controllers/auth.controller.js";

import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  getPendingUsers,
  updateUserApproval,
  getApprovedUsers,
  adminUpdateUser
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
router.get("/pending-users", protectRoute, isAdmin, getPendingUsers);
router.put("/approve-user/:userId", protectRoute, isAdmin, updateUserApproval);
router.get("/approved-users", protectRoute, isAdmin, getApprovedUsers);
router.get("/pending-users", protectRoute, isAdmin, getPendingUsers);
router.put("/admin-update-user/:userId", protectRoute, isAdmin, adminUpdateUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);


router.post("/admin-login", adminLogin);

export default router;
