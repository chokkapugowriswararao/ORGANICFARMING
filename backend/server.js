import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import customerRoutes from "./routes/customer.route.js";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes); // Add customer route

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
