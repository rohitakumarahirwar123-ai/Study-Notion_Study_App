const { passwordReset } = require("../mail/templates/passwordReset");
const User = require("../models/User");
const mailSender =  require("../utiils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

// Reset password token -> frontend link hai jo email me jayegi
exports.resetPasswordToken = async(req, res) => {
    
    try {
         // Fetch data from req
        const email = req.body.email;

        // email validation
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User didnot registed , please signup "
            })
        }

         // generate Token
        const token = crypto.randomUUID();
        console.log(token);

        // update db
        const updateUser = await User.findOneAndUpdate({email:email},
            {
                token: token,
                resetPasswordExpires: Date.now()+5*60*1000
            },
            {new: true}

        )
        
        const url = `${process.env.FRONTEND_URL}/update-password/${token}`;

        await mailSender(email,"Reset Password Link: ", passwordReset(email,url));

        res.status(200).json({
            success: true,
            message: "Reset password link generated successfully"
        })
  
    } catch (error) {
    console.log("Error occured in reset password: ", error);
     return res.status(400).json({
            success: false,
            message: "Error in Reset password"
        })
        
    }
}


exports.resetPassword = async (req,res)=>{
    try {
        const {password,confirmPassword,token} = req.body;

        // validation
        if(password !== confirmPassword){
        return res.json({
                success: false,
                message: "Password and confirm password didn't match"
            })
        }
        // get user details by token
        const userDetail = await User.findOne({token:token})

        // if no entry -> token didn,t match
    
        if(!userDetail){
            return res.json({
                success: false,
                message: "Token is invalid"
            })
        }

        // token time expires 
        if(userDetail.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is expired"
            })
        }

        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password in db
        await User.findOneAndUpdate({token:token},{password: hashedPassword});

        // send response
        res.status(200).json({
            success: true,
            message: "Password change successfully"
        })

            
    } catch (error) {
        console.log("Error occures in reset password: ", error);
         return res.status(400).json({
            success: false,
            message: "Error in Reset password"
        })
        
        
    }
}