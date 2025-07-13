import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// signup new User
export const Signup = async (req,res)=>{
    const {fullName, email, password, bio} = req.body;
    try{
        if(!fullName || !email || !password ||!bio){
            return res.json({success:false, message:"missing Details"})
        }
        const user = await User.findOne({email});
        if(user){
             return res.json({success:false, message:"Already Exist"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword,
            bio
        });

        const token = generateToken(newUser._id)
        res.json({
            success:true,
            UserDate:newUser, token, message:"Account Created Successfully"
        })

    }catch(error){
        console.log(error.message)
        res.json({
            success:false,
            message:"error.message"
        })
    }
}

//controller to login a User
export const login = async (req, res)=>{
    try {
        const {email, password}=req.body;
        const userData = await User.findOne({email})
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({
                success:false,
                message:"Invalid Credentials"
            });
        }
         const token = generateToken(userData._id)
        res.json({
            success:true,
            userData, token, message:"Login Successfully"
        })
    } catch (error) {
          console.log(error.message)
        res.json({
            success:false,
            message:"error.message"})
    }
}

//controller to check is user is Authenticated or not
export const checkAuth = (req, res)=>{
    res.json({
        success:true,
        user:req.user
    });x
}

//controller to update User profile details
export const updateProfile = async (req,res)=>{
    try {
        const {profilePic, bio, fullName}=req.body;

        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){
            await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});

        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new:true});
        }
        res.json({
            success:true,
            user:updatedUser
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })
    }
}