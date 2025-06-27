import React, { useState, useRef, useContext, useEffect } from "react";
import {
  CodesandboxIcon,
  LockKeyhole,
  Mail,
  EyeOff,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schemas
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const { backendUrl,loggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [timer, setTimer] = useState(5);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  // Start countdown on email send
  useEffect(() => {
    let interval;
    if (emailSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [emailSent, timer]);

  // Email Form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({ resolver: zodResolver(emailSchema) });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  // OTP input logic
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    e.target.value = value;
    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputs.current[index]) {
        inputs.current[index].value = char;
      }
    });
  };

  // API Calls
  const onSubmitEmail = async ({ email }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { withCredentials: true }
      );
      if (data.success) {
        setEmail(email);
        setEmailSent(true);
        setTimer(30);
        setCanResend(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    onSubmitEmail({ email });
  };

  const onSubmitOtp = (e) => {
    e.preventDefault();
    const otpArray = inputs.current.map((el) => el.value);
    const joinedOtp = otpArray.join("");
    if (joinedOtp.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    setOtp(joinedOtp);
    setOtpSent(true);
  };

  const onSubmitNewPassword = async ({ newPassword }) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, newPassword, otp },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };


useEffect(() => {
    
         loggedIn &&  navigate('/');
    },[ loggedIn]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      >
        <CodesandboxIcon size={60} />
      </div>

      {/* STEP 1: EMAIL INPUT */}
      {!emailSent && (
        <form
          onSubmit={handleSubmitEmail(onSubmitEmail)}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-1 text-indigo-200">
            Enter your registered email address
          </p>
          <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <Mail size={25} />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none text-white w-full"
              {...registerEmail("email")}
              required
            />
          </div>
          {emailErrors.email && (
            <p className="text-red-400 mt-1 ml-1">{emailErrors.email.message}</p>
          )}
          <button className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP INPUT */}
      {emailSent && !otpSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Enter OTP
          </h1>
          <p className="text-center mb-1 text-indigo-200">
            Enter the 6-digit code sent to your email
          </p>
          <div
            className="flex justify-between mb-4"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  className="w-12 h-12 bg-[#363a4b] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputs.current[index] = el)}
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
          <p className="text-center mt-3 text-sm text-indigo-300">
            Resend OTP in {timer}s
          </p>
          <button
            type="button"
            disabled={!canResend}
            onClick={resendOtp}
            className={`mt-2 text-indigo-400 underline text-center w-full ${
              !canResend && "opacity-40 cursor-not-allowed"
            }`}
          >
            Resend OTP
          </button>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD INPUT */}
      {otpSent && emailSent && (
        <form
          onSubmit={handleSubmitPassword(onSubmitNewPassword)}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-1 text-indigo-200">
            Enter your new password below
          </p>

          {/* Password */}
          <div className="relative flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-3">
            <LockKeyhole />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="New Password"
              className="bg-transparent outline-none text-white w-full"
              {...registerPassword("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 text-white focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordErrors.newPassword && (
            <p className="text-red-400 text-center mb-2">
              {passwordErrors.newPassword.message}
            </p>
          )}

          {/* Confirm Password */}
          <div className="relative flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-3">
            <LockKeyhole />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="bg-transparent outline-none text-white w-full"
              {...registerPassword("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 text-white focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordErrors.confirmPassword && (
            <p className="text-red-400 text-center mb-2">
              {passwordErrors.confirmPassword.message}
            </p>
          )}

          <button className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
