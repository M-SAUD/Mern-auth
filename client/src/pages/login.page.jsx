import React, { useContext, useState ,useEffect} from "react";
import { CircleUserRound, Codesandbox, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAuthButton from "../components/GoogleAuthButton";

// Zod Schemas
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { backendUrl, setLoggedIn, getUserData , loggedIn } = useContext(AppContext);

  // Dynamic schema switching
  const schema = state === "Sign Up" ? signupSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmitHandler = async (data) => {
    setLoading(true);

    try {
      const endpoint =
        state === "Sign Up"
          ? `${backendUrl}/api/auth/register`
          : `${backendUrl}/api/auth/login`;

      const config = { withCredentials: true };

      const response = await axios.post(endpoint, data, config);

      setLoading(false);

      if (response.data.success) {
        setLoggedIn(true);
        getUserData();
        reset();
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

useEffect(() => {
    
         loggedIn &&  navigate('/');
    },[ loggedIn]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <Codesandbox
        size={60}
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-200 text-sm">
        <h2 className="text-[2rem] font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-[1.2rem] text-center">
          {state === "Sign Up" ? "Create Your Account" : "Login To Your Account!"}
        </p>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="mt-4">
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#333A5C]">
              <CircleUserRound size={25} />
              <input
                {...register("name")}
                className="bg-transparent text-white outline-none w-full"
                type="text"
                placeholder="Full name"
              />
            </div>
          )}
          {errors.name && (
            <p className="text-red-400 text-sm mb-2 ml-1">{errors.name.message}</p>
          )}

          <div className="mb-4 flex items-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#333A5C]">
            <Mail size={25} />
            <input
              {...register("email")}
              className="bg-transparent text-white outline-none w-full"
              type="email"
              placeholder="Email"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mb-2 ml-1">{errors.email.message}</p>
          )}

          <div className="mb-3 flex items-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#333A5C] relative">
            <LockKeyhole size={25} className="text-white" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="bg-transparent text-white outline-none w-full pr-10"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 text-white focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mb-2 ml-1">{errors.password.message}</p>
          )}

          <p
            onClick={() => navigate("/reset-password")}
            className="ml-1.5 mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full tracking-wide py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold"
          >
            {loading ? "Loading..." : state}
          </button>
        </form>
        
        <div className="flex items-center justify-center mt-4">
  <div className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
    <GoogleAuthButton />
  </div>
</div>

        {state === "Sign Up" ? (
          <p className="mt-4 text-center">
            Already have an Account?{" "}
            <span
              onClick={() => setState("Login")}
              className="ml-1 text-blue-400 underline cursor-pointer"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-center">
            Don't have an Account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="ml-1 text-blue-400 underline cursor-pointer"
            >
              Sign-Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
