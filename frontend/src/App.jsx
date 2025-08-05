import { useState } from 'react'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Register from './pages/auth/Register.jsx'
import Home from './pages/home/home.tsx'
import Landingpage from './pages/home/landingpage'
import Login from './pages/auth/Login.jsx'
import LoginGuard from './shared/guards/loginGuard.tsx'
import AuthGuard from './shared/guards/authGuard.tsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import SearchedProfilePage from './pages/profiles/SearchedProfilePage.tsx'


function App() {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={
          <LoginGuard>
            <Landingpage />
          </LoginGuard>  
        
        } />
        
        <Route path="/register" element={
          <LoginGuard>
            <Register />
          </LoginGuard>  
        } />
        
        <Route path="/login" element={
          <LoginGuard>
            <Login />
          </LoginGuard>  
        } />

        <Route path="/reset-password" element={
          <LoginGuard>
            <ResetPassword /> 
          </LoginGuard>  
        } />


        <Route path="/home" element={
          <AuthGuard>
            <Home />
          </AuthGuard>  

        } />

        
        <Route path="/profile/:id" element={
          <AuthGuard>
            <SearchedProfilePage /> 
          </AuthGuard>  
        } />
        
      </Routes>
      
    </div>
  )
}

export default App
