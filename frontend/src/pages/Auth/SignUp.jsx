import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'


const SignUp = () => {
  return (
    <>
      <div className='h-screen bg-cyan-50 overflow-hidden relative'>

        <div className='login-ui-box right-10 -top-50'></div>
        <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2'></div>
        <div className='login-ui-box bg-cyan-100 left-50'></div>
        <div className='container h-screen flex items-center justify-center px-15 mx-auto'>
          {/* Left Side - Image Section */}
          <div className='w-1/2 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
            <div>
              <h4 className='text-5xl text-white font-bold leading-[58px]'>
              Join Us <br />& Begin Your Story
              </h4>
              <p className='text-[20px] text-white font-medium leading-6 pr-7 mt-4'>
                <span className='text-yellow-300'>Create an account</span> and start capturing the moments that matter.
              </p>
            </div>
          </div>
          {/* Right Side - Login Form */}
          <SignUpForm />
        </div>
      </div>
    </>
  )
}


const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
 
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if(!name){
      setError("Please enter your name");
      return
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return
    }
    if(!password){
      setError("Enter your password");
      return
    }

    setError("");

    // Signup Api call
    try {
      const response = await axiosInstance.post("/user/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      console.log({ fullName: name, email: email, password: password });
      // Hand Successful signup response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard")
      }
    } catch (error) {
      // Signup Error
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError("Unexpected error occurred, Please try again")
      }
    }
  }
  const navigate = useNavigate(); 

  return (
    <>
      <div className='w-[40%] h-[55vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20 items-center'>
        <form onSubmit={handleSignUp}>
          <h4 className='text-2xl font-semibold mb-7'>Sign Up</h4>
          <input type="text" placeholder='Full Name' className='input-box' value={name} onChange={(e) => { setName(e.target.value)}}/>
          <input type="text" placeholder='Email' className='input-box' value={email} onChange={(e) => { setEmail(e.target.value)}}/>
          <PasswordInput value={password} placeholder={"Set Password"} onChange={(e) => { setPassword(e.target.value)}}/>

          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

          <button type='submit' className='btn-primary font-semibold'>CREATE ACCOUNT</button>
          <p className='text-xs text-slate-500 text-center my-4'>Or</p>

          <button type='button' className='btn-primary btn-light font-semibold' onClick={() => {
            navigate('/login'); 
          }}>
            LOGIN
          </button>
          
        </form>
      </div>
    </>
  )
}

export default SignUp
