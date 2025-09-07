import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    } 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName: fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    generateToken(newUser._id, res);
    
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid user credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid user credentials" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "Your account is awaiting admin approval." });
    }
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isApproved: user.isApproved, // ✅ FIXED
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const logout =  (req,res) => {
   try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
   } catch (error) {
    console.log("error in  logout controller",error.message);
        res.status(500).json({message:"internal server error"});
   }
};

export const updateProfile = async(req,res) =>{
    try {
        const {profilePic} = req.body;
       const userId =  req.user._id;

   if(!profilePic){
    return res.status(400).json({message:"Profile pic  is required"});
   }

   const uploadResponse= await cloudinary.uploader.upload(profilePic);
   const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

   res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in updated profile");
        res.status(500).json({message:"internal server error"}); 
    }

}

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // ⏳ Get pending users
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// ✅ Admin: Update any user
export const adminUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Don't allow password update here directly
    if (updateData.password) {
      return res.status(400).json({ message: "Password update not allowed here" });
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Admin user update failed:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: true }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching approved users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateUserApproval = async (req, res) => {
  const { userId } = req.params;
  const { approve } = req.body; // true to approve, false to reject

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isApproved: approve },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = approve ? "User approved successfully" : "User rejected";
    res.status(200).json({ message, user: updatedUser });
  } catch (error) {
    console.error("Error updating user approval:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!adminUser.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    if (!adminUser.isApproved) {
      return res.status(403).json({ message: "Admin account not approved yet." });
    }

    generateToken(adminUser._id, res);

    res.status(200).json({
      _id: adminUser._id,
      fullName: adminUser.fullName,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin,
      profilePic: adminUser.profilePic,
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
