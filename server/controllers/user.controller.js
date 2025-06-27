import userModel from "../models/user-model.js";

export const getUserData=async(req,res)=>{


    try {
        const userId = req.userId;


        const user = await userModel.findById(userId)
        if(!user){
             return res.status(404).json({
      success:false,
      message:'User Not found'
    })
        }

         return res.status(200).json({
      success:true,
      userData:{
        name:user.name,
        email:user.email,
        isVerified:user.isVerified,

      }
    })
    } catch (error) {
         return res.status(500).json({
      success:false,
      message:'Error in fetching user Data'
    })
    }
}