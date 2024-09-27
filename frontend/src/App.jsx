import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './index.css'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home/Home'

const App = () => {
  return (
    <>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={ <Root /> }/>
          <Route path="/dashboard" exact element={ <Home /> }/>
          <Route path="/login" exact element={ <Login /> }/>
          <Route path="/signup" exact element={ <SignUp /> }/>
        </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

// Define the root component to handle the initial redirect 
const Root = () => {
  // check if there are token in localstroage
  const isAuthenticated = !!localStorage.getItem('token')


  // Redirect to dashboard if authenticated, other wise to login page
  return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)
}
export default App
