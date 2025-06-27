// src/components/GoogleAuthButton.jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

function GoogleAuthButton() {
  const navigate = useNavigate();
  const { backendUrl, getUserData, setLoggedIn } = useContext(AppContext);


  const handleSuccess = async (credentialResponse) => {

    console.log(`${backendUrl}/api/auth/google-login`)
    try {
      const idToken = credentialResponse.credential;

     const{data}= await axios.post(
        `${backendUrl}/api/auth/google-login`,
        { idToken },
        { withCredentials: true }
      );


      if(data.success){
       await getUserData();
      setLoggedIn(true);
      navigate('/');
      }else{
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message)
      console.error("Google login error:", error);
    }
  };

  return (
    <GoogleLogin
  onSuccess={handleSuccess}
  onError={() => toast.error("Google Login Failed")}
  theme="outline"
  shape="pill"
  text="signin_with"
  size="large"
/>
  );
}

export default GoogleAuthButton;
