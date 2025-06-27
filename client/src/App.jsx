import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Homepage from './pages/home.page'
import LoginPage from './pages/login.page'
import EmailVerifyPage from './pages/emailverify.page'
import ResetPasswordPage from './pages/resetpassword.page'
import { ToastContainer } from 'react-toastify';
import BrevoChat from './components/brevochat'

const App = () => {
  return (
    <div>
      <ToastContainer />
      
     <Routes>

      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/email-verify' element={<EmailVerifyPage/>}/>
      <Route path='/reset-password' element={<ResetPasswordPage/>}/>
     </Routes>
    </div>
  )
}

export default App

