import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import userRouter from "./routes/UserRoutes.js";

dotenv.config();

const connection = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connection successful!");
    }
    catch(err){
        console.error("MongoDB connection failed: ",err.message); 
        process.exit(1);
    }
    
};


connection();



const app = express();
app.use(express.json()); //middleware


app.use("/api/users",userRouter);

app.get('/api/users/signup', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
