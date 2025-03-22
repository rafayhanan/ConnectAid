import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import userRouter from "./routes/UserRoutes.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connection successful!");
  } catch (err) {
    console.error("MongoDB connection failed: ", err.message);
    process.exit(1);
  }
};

connectDB();


const app = express();
app.use(express.json());


app.use("/api/users", userRouter);
app.use('/uploads', express.static('uploads'));



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
