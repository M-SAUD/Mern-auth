import React from "react";
import { LogIn } from "lucide-react";
import { Codesandbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setLoggedIn } =
    useContext(AppContext);
  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout",{}, {
        withCredentials: true,
      });
      console.log(data)
      data.success && setUserData(false);
      data.success && setLoggedIn(false);
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  console.log(userData);

  const sendOpt= async()=>{
     try {
      const {data} =await axios.post(backendUrl+'/api/auth/send-verify-otp',{},{
        withCredentials:true
      })
       console.log('vrif sadat',data)
      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
     } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong. Try again.";
    toast.error(message);
     }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <Codesandbox size={60} />
      {userData ? (
        <div className="w-8 h-8 flex  justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className=" absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-full pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {userData?.isVerified ? (
                <div className="py-1 px-2 whitespace-nowrap">Account Verified ✅</div>
              ) : (
                <li onClick={sendOpt} className="py-1 px-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap">
                  Verify Email
                </li>
              )}

              <li onClick={logout} className="py-1 px-2 pr-10 hover:bg-gray-200 cursor-pointer whitespace-nowrap">
                Sign Out
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800  hover:bg-gray-100 
        transition-all"
        >
          Login <LogIn />
        </button>
      )}
    </div>
  );
};

export default Navbar;
