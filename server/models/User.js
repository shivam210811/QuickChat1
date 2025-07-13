import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        requieed:true,
        unique:true
    },
    fullName:{
        type: String,
        requieed:true,
     
    },
    password:{
        type: String,
        requieed:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default:""
    },
    bio:{
        type:String
    }
}, {timestamps:true});

const User = mongoose.model("User", userSchema);

export default User;