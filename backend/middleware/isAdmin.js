export const isAdmin = (req, res, next) => {
  console.log("req.user in isAdmin middleware:", req.user); // ✅ ADD THIS

  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
