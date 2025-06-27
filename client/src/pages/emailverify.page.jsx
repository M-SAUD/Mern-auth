import { CodesandboxIcon } from "lucide-react";
import React ,{  useRef } from "react";
import { useContext } from "react";
import { AppContext } from "../context/context";
import { useEffect } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";
const EmailVerifyPage = () => {

  const navigate= useNavigate();
  const { userData,backendUrl , loggedIn,getUserData } = useContext(AppContext);

  const email = userData?.email || "";

   const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Accept only numbers
    if (!/^[0-9]?$/.test(value)) return;

    e.target.value = value;

    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
  inputs.current[index - 1].focus();
} else if (e.key === 'ArrowRight' && index < inputs.current.length - 1) {
  inputs.current[index + 1].focus();
}



  };

   const handlePaste = (e)=>{
    const paste =e.clipboardData.getData('text');
    const pasteArray= paste.split('');

    pasteArray.forEach((char,index)=>{
      if(inputs.current[index]){
        inputs.current[index].value=char
      }
    })
   }
  
   const onSubmitHandler= async (e)=>{

    try {
      e.preventDefault();
      const otpArray = inputs.current.map(e=>e.value)
      const otp = otpArray.join('');

      const{data } = await axios.post(backendUrl+'/api/auth/verify-account',{otp},{withCredentials:true})

      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
   }

   useEffect(() => {
  inputs.current[0]?.focus();
}, []);

   useEffect(() => {
    
         loggedIn && userData?.isVerified && navigate('/');
    },[ loggedIn,userData]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div onClick={navigate('/')} className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer">
        <CodesandboxIcon size={60} />
      </div>
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-1 text-indigo-200">
          Enter the 6-digit Code sent to your Email{" "}
        </p>
        <p className="text-center mb-6 text-indigo-200">{email}</p>
        <div className=" flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength={1}
                required
                key={index}
                inputMode="numeric"
                
                className='w-12 h-12 bg-[#363a4b] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                 onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
              />
            ))}
        </div>
        <button className="w-full  py-3  bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerifyPage;
