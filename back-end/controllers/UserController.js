import bycrpt from "bcryptjs";
import User from "../models/User.js";


const addUser = async (req , res) =>{
    const {firstName,lastName,email,password,dateOfBirth} = req.body;

    const user = User.findOne({email});
    try{
        if(user){
            //400 is bad request
            res.status(400).json({message:"User already exists"});
        }else{
            //hashing the password for better security
            const salt = bycrpt.genSalt(10);
            const hashedPassword = bycrpt.hash(password,salt);


            //create new user
            const newUser = new User(
                firstName,
                lastName,
                email,
                hashedPassword,
                dateOfBirth
            );

            await newUser.save();


            //201 is when a new resource is created
            res.status(201).json({message:"User registered succesfully!"});
        }

    }catch(err){
        //500 is internal server error
        res.status(500).json({message:`Server Error: ${err}`});
    }
};


export default addUser;