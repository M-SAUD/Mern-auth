import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";
import transporter from "../config/nodemailer.js";
import Joi from "joi";
import {welcomeMail,verifyMailOptions,resetPasswordmailOptions} from "../utils/mailoption.js";


// ----------------------------------  Register User ----------------------------\\
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name should have at least 3 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
  }),
});
export const register = async (req, res) => {
  const { name, email, password } = await req.body;

  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.json({
        success: false,
        message: "email already exits",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    //generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // respose with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    // sendin email
    await transporter.sendMail(welcomeMail(user.email, user.name));

    res.status(200).json({
      success: true,
      message: "Register Successfull",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ----------------------------------  Login User ----------------------------\\

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
  }),
});


export const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);
   if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect Mail",
        success: false,
      });
    }

    const checkAuth = await bcrypt.compare(password, user.password);

    if (!checkAuth) {
      return res.status(400).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // respose with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Successfull Logged In",
    });
  } catch (error) {}
};

// ----------------------------------  Logout User ----------------------------\\

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path:'/'
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return (
      res,
      json({
        success: false,
        message: error.message,
      })
    );
  }
};


// ----------------------------------  Send OTP ----------------------------\\
export const sendVerifyOtp = async (req, res) => {
  try {
    const  userId  = req.userId;
    const user = await userModel.findById(userId);

    if (user.isVerified) {
      return res.status(200).json({
        success: false,
        message: "Account Already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();


    await transporter.sendMail(verifyMailOptions(user.email, user.name, otp));

    res.json({
      success: true,
      message: "Verification OTP sent to Email",
    });
  } catch (error) {
    res.json({
      success: true,
      message: ("verification failed", error.message),
    });
  }
};


// ----------------------------------  Verify User Email ----------------------------\\
const otpVerifySchema = Joi.object({
  otp: Joi.string().length(6).required().messages({
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be exactly 6 digits',
  }),
});

export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;

  const { error } = otpVerifySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    
    const user = await userModel.findById(userId);
     if(!user){
      return res.json({
        success:false,
        message:'User Not Found'
      })
     }

     if (user.verifyOtp===''|| user.verifyOtp !== otp ){
      return res.json({
        success:false,
        message:'Invalid OTP'
      })
     }

     if(user.verifyOtpExpireAt < Date.now()){
      return res.json({
        success:false,
        message:'OTP Expired'
      })
     }

     user.isVerified = true;
     user.verifyOtp='';
     user.verifyOtpExpireAt=0;

     await user.save()
     return res.json({
      success:true,
      message:'Email Verified Successfully'
     })

  } catch (error) {
    return res.json({
      success:false,
      message:error.message
    })
  }


};


// ----------------------------------check if the user is Authenticated ----------------------------\\

export const isAuthenticated = async (req,res)=>{

  try {
      return res.status(200).json({
      success:true,
      message:'Authenticated success'
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }

};



// ----------------------------------send password reset otp ----------------------------\\
const emailOnlySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),
});


export const sendResetOtp = async (req,res)=>{
   
  const {email}=req.body;

   const { error } = emailOnlySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {

    const user = await userModel.findOne({email}); 

    if(!user){
       return res.status(500).json({
      success:false,
      message:'User not Found'
    })
    }
    if (user.isGoogleUser) {
  return res.status(400).json({
    success: false,
    message: 'This account uses Google login. You cannot reset password manually.',
  });
}

     
     const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = otp;
    user.resetOtpExpireAt= Date.now() + 15 * 60 * 1000;

    await user.save();

     

    await transporter.sendMail(resetPasswordmailOptions(user.email, user.name, otp));

      return res.status(200).json({
      success:true,
      message:'Otp sent to Email'
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }

}


// ----------------------------------Reset the User Password ----------------------------\\
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be 6 digits',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 8 characters',
  }),
});

export const resetPassword = async (req,res)=>{

  const{email,otp,newPassword}= req.body;

 const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }


   try {
    const user = await userModel.findOne({email});

    if(!user){
       return res.status(500).json({
      success:false,
      message:'User Not Found'
    })
    }

    if(user.resetOtp===''|| user.resetOtp!==otp){
       return res.status(500).json({
      success:false,
      message:'Invalid Otp'
    })
    }
    if(user.resetOtpExpireAt < Date.now() ){
       return res.status(500).json({
      success:false,
      message:'Otp Expired'
    })
    }
    
    const hashedPassword= await bcrypt.hash(newPassword,10);

    user.password=hashedPassword;
    user.resetOtp='';
    user.resetOtpExpireAt=0;
    await user.save();

     return res.status(200).json({
      success:true,
      message:"Password have successfully reset"
    })

   } catch (error) {
     return res.status(500).json({
      success:false,
      message:error.message
    })
   }
}