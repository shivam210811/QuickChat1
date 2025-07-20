import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilePage';
import {Toaster} from "react-hot-toast"
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';


const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-[url('./bgImage-Pd-Wd13i.svg')] h-screen w-full bg-contain">
      <Toaster/>
    <Routes>

      <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
      <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
      <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
    </Routes>
    </div>
  );
}

export default App;
