import { createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast"
import { useState } from "react";
import { useEffect } from "react";
import {io} from "socket.io-client";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();
export const AuthProvider = ({ children})=>{
    const [token, setToken]= useState(localStorage.getItem("token"));
    const[authUser, setAuthUser]= useState(null);
    const[onlineUsers, setOnlineUsers]= useState([]);
    const[socket, setSocket]= useState(null);

    //check the user is authenticated or not or if so set the user data and connect the socket
    const checkAuth = async()=>{
        try {
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //login user function to handle uwser authenticated and socket connection

  const login = async (state, credentials) => {
  try {
    const { data } = await axios.post(`/api/auth/${state}`, credentials);
    if (data.success) {
      setAuthUser(data.userData);
      connectSocket(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      return { success: true }; // ✅ return result
    } else {
      toast.error(data.message);
      return { success: false };
    }
  } catch (error) {
    toast.error(error.message);
    return { success: false }; // ✅ return failure
  }
};


    //logout function to handle user logout and socket disconnection
 const logout = async () =>{
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("logout Successfully")
    socket.disconnect();
 }  
 
 //Update profile function to handle user profile Update
 const updateProfile = async (body) => {
    try {
        const { data } = await axios.put("/api/auth/update-profile", body); // Ensure this matches your backend
        if (data.success) {
            setAuthUser (data.user);
            toast.success("Profile updated successfully");
        } else {
            toast.error("Profile update failed");
        }
    } catch (error) {
        console.error("Error updating profile:", error.response ? error.response.data : error.message);
        toast.error(error.response ? error.response.data.message : error.message);
    }
};



//connect socket function to handle socket connection and online usrs updates
const connectSocket = (userData)=>{
    if(!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
        query:{
            userId: userData._id,

        }
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds)=>{
         
    })
}

    useEffect(() => {
     if(token){
        axios.defaults.headers.common["token"]=token;
     }
     checkAuth();
    }, [])
    
    const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login, // ✅ this makes login available in useContext(AuthContext)
    logout,
    updateProfile
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}