import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io"; // ✅ fixed

const app = express();
const server= http.createServer(app)

//iniatilize socket.io server
export const io = new Server(server,{
    cors: {origin: "*"}
})

//store online user
export const userSocketMap = {}; // {userid :socketId}

//socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user connected ", userId)

    if(userId) userSocketMap[userId] = socket.id;

    //emit online user to ll connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnected", ()=>{
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

//adding miidleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());


app.use("/api/status", (req,res)=>res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to MongoDb
await connectDB();


const PORT = process.env.PORT || 5000

server.listen(PORT, ()=>console.log(`Server is running on ${PORT}`))