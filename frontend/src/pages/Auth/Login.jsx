import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'


const Login = () => {
  return (
    <>
      <div className='h-screen bg-cyan-50 overflow-hidden relative'>

        <div className='login-ui-box right-10 -top-50'></div>
        <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2'></div>
        <div className='login-ui-box bg-cyan-100 left-50'></div>
        <div className='container h-screen flex items-center justify-center px-15 mx-auto'>
          {/* Left Side - Image Section */}
          <div className='w-1/2 h-[90vh] flex items-end bg-login-sea-img bg-cover bg-center rounded-lg p-10 z-50'>
            <div>
              <h4 className='text-5xl text-white font-bold leading-[58px]'>
                Capture Your <br />Memories
              </h4>
              <p className='text-[20px] text-white font-medium leading-6 pr-7 mt-4'>
                <span className='text-yellow-300'>Begin a New Chapter.</span> Embrace your story, every joy, every challenge. Let your words become a place where your heart feels heard and your thoughts find peace.
              </p>
            </div>
          </div>
          {/* Right Side - Login Form */}
          <LoginForm />
        </div>
      </div>
    </>
  )
}


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return
    }
    if(!password){
      setError("Enter your password");
      return
    }

    setError("");

    // Login Api call
    try {
      const response = await axiosInstance.post("/user/login", {
        email: email,
        password: password,
      });

      // Hand Successful login response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard")
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
        console,log(error)
      } else {
        setError("Unexpected error occurred, Please try again")
      }
    }
  }
  const navigate = useNavigate(); 

  return (
    <>
      <div className='w-[40%] h-[55vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20 items-center'>
        <form onSubmit={handleLogin}>
          <h4 className='text-2xl font-semibold mb-7'>Login</h4>
          <input type="text" placeholder='Email' className='input-box' value={email} onChange={(e) => { setEmail(e.target.value)}}/>
          <PasswordInput value={password} onChange={(e) => { setPassword(e.target.value)}}/>

          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

          <button type='submit' className='btn-primary font-semibold'>LOGIN</button>
          <p className='text-xs text-slate-500 text-center my-4'>Or</p>

          <button type='button' className='btn-primary btn-light font-semibold' onClick={() => {
            navigate('/signup'); 
          }}>
            CREATE ACCOUNT
          </button>
          
        </form>
      </div>
    </>
  )
}

export default Login
