import mongoose from "mongoose";

//Functio for connection to the database
export const connectDB= async ()=>{
    try{
        mongoose.connection.on('connected', ()=>console.log('Databse Connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/ChatApp`)
    } catch(error){
        console.log(error);
    }
}