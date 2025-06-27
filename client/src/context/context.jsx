import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";


export const AppContext = createContext(null);
export  const AppContextProvider=({children})=>{
    
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const[loggedIn,setLoggedIn]=useState(false);
    const[userData,setUserData]=useState(null);

    const getAuthState= async()=>{
         try {
            const {data} =await axios.get(backendUrl + '/api/auth/is-auth', {
      withCredentials: true, 
    });

    if(data.success){
        setLoggedIn(true)
        getUserData()
    }
         } catch (error) {
              toast.error(error.message)
         }
    }

    const getUserData= async ()=>{
         try {
              const { data } = await axios.get(backendUrl + '/api/user/data', {
      withCredentials: true, 
    });
            data.success ?  setUserData(data.userData) : toast.error(data.message)
            console.log(data)
            
         } catch (error) {
            toast.error(error.message)
         }
    }


    useEffect(()=>{
        getAuthState();
    },[])
    return(
        <AppContext.Provider value={{loggedIn,setLoggedIn,userData,setUserData ,backendUrl,getUserData}}>
                      {children}
        </AppContext.Provider>
    )
}