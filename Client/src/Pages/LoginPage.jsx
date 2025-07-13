import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom'; // ✅ Added for redirect

const LoginPage = () => {
  const navigate = useNavigate(); // ✅ Used to redirect after login/signup
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
    } else {
      const credentials = {
        email,
        password,
        ...(currentState === "Sign Up" ? { fullName, bio } : {}),
      };

      // ✅ Only fixed route name and added redirect
      const result = await login(currentState === "Sign Up" ? "signup" : "login", credentials);
      if (result?.success) {
        navigate("/"); // ✅ Redirect to home if successful
      }
    }
  };

  const toggleState = () => {
    setCurrentState(prev => (prev === "Sign Up" ? "Login" : "Sign Up"));
    setIsDataSubmitted(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} alt="Logo" className='w-[min(30vw,250px)]' />
      <form onSubmit={handleSubmit} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
          <img src={assets.arrow_icon} alt="Toggle" onClick={toggleState} className='cursor-pointer w-5' />
        </h2>

        {currentState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type='text'
            placeholder='Full Name'
            className='p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='Please Enter Your Registered Email'
              className='p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Please Enter Your Registered Password'
              className='p-2 border bg-transparent border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </>
        )}

        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='bg-transparent p-2 border-gray-500 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Provide a Short Bio'
            required
          />
        )}

        <button
          type='submit'
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {currentState === "Sign Up"
            ? isDataSubmitted
              ? "Submit Profile"
              : "Create Account"
            : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm'>
          <input type='checkbox' required />
          <p>Agree to the Terms of Use & Privacy Policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currentState === "Sign Up" ? (
            <p className='text-sm text-gray-300'>
              Already have an account?{" "}
              <span onClick={toggleState} className='font-medium text-violet-400 cursor-pointer'>
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-300'>
              Don’t have an account?{" "}
              <span onClick={toggleState} className='font-medium text-violet-400 cursor-pointer'>
                Create one
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
