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
          <Route path="/dashboard" exact element={ <Home /> }/>
          <Route path="/login" exact element={ <Login /> }/>
          <Route path="/signup" exact element={ <SignUp /> }/>
        </Routes>
      </BrowserRouter>
    </div>
    </>
    
  )
}

export default App

/*
<BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/signup' element={<Siginup />}/>
          <Route path='/signin' element={<Signin />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/send' element={<SendMoney />}/>
        </Routes>
      </BrowserRouter>
*/ 