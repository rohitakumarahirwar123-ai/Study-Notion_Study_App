const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
require("dotenv").config();

// Send otp
exports.sendOtp = async(req, res)=>{
    try {
        const {email} = req.body;
        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(403).json({
                    success: false,
                    message: "User already registered"
                })
        }

        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        while(await OTP.findOne({otp})){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
        }
        
        const savedOtp = await OTP.create({email,otp});

        return res.status(200).json({
            success: true,
            message: "Otp send succesfully"
        })

    } catch (e) {
        console.log("Error occured while sending otp", e);
        return res.status(400).json({
            success: false,
            message: "Error in generating otp",
            error: e
        
    });    
}
}


// Log in
exports.login = async(req,res)=>{
    try {
         const {email,password} = req.body;
         console.log("Login request received with email: ", email);
    
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Fill all details"

            })
        }
        // User exist or not
        const user = await User.findOne({email}).populate("additionalDetails").exec();
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User doesn't exist, please signup first"
            })
        }

        // Password check
        
        if(await bcrypt.compare(password, user.password)){

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.TOKEN_PASS,{
                expiresIn: "3d"
            });

            const options = {
                expires: new Date( Date.now()+ 3*24*60*60*1000),
                httpOnly: true
            }
        
           return res.cookie("token", token, options).status(200).json({
                success: true,
                token: token,
                user: user,
                message: "Token saved in cookie"
            })
        }
        return res.status(403).json({
            success: false,
            message: "Data is invalid or Password is wrong"
        })


}catch (e) {
    console.log("Error occured while login: ", e);
    return res.status(500).json({
        success: false,
        message: "Error occured in login: "
    })
        
    }
}
   
// Sign in

exports.signin = async(req,res)=>{
    try {
        // Data fetch
         const {firstName,lastName,email,password,confirmPassword,accountType,additionalDetails, otp} = req.body;
 
    
        // validate
        if(!firstName || !lastName || !email || !password || !confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Fill all details"
            })
        }
        // password = confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirm password didn't match"
            })
        }
        // user already exist or not
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(401).json({
                success: false,
                message: "User already Exist"
            })
        }
        

        // find most recent otp store for the user
        const dbotp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log("Otp",dbotp);
        const currentOtp = dbotp.otp;
        // validate otp
        if(currentOtp !== otp){
            console.log(currentOtp, otp)
            return res.status(403).json({
                success: false,
                data: currentOtp,
                message: "Enter valid otp"
            })
        }




        // hash password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // entry create databse
        const profile = {
            gender: null,
            contactNumber: null,
            about: null,
            dateOfBirth: null
        }
        const profileData = await Profile.create(profile);
        const fullName = `${firstName} ${lastName}`;
        const image = `https://api.dicebear.com/9.x/initials/svg?seed=${fullName}`;


        const savedUser = await User.create({
            firstName,
            lastName,
            email,
            image,
            password: hashPassword,
            accountType,
            additionalDetails: profileData._id
        })

        // res send
        res.status(200).json({
            success: true,
            message: "User registered successfully"
        })
    }catch (e) {
            console.log("Error occured while login: ", e);
            return res.status(500).json({
                success: false,
                message: "Error occured in signin: ",
                error: e
            })
            
        }
    }
        

// change Password
exports.changePassword = async(req,res)=>{
    try {
            const {email,password,newPassword, confirmNewPassword} = req.body;
            const user = await User.findOne({email});

            if(newPassword !== confirmNewPassword){
                return res.status(403).json({
                    success:false,
                    message: "Password and confirm password didn't match"
                })
            }


            if(await bcrypt.compare(password, user.password)){
               const hashPassword = await bcrypt.hash(newPassword, 10);
                console.log(hashPassword)
                const updatedUser = await User.findOneAndUpdate(
                    {email: email},
                    { $set: {password :hashPassword} },
                    {new: true}
                )
                console.log(updatedUser)
                return res.status(200).json({
                    success: true,
                    message: "Password updated Successfully"
                })
            }
            res.status(401).json({
                success: false,
                message: "Old password is wrong"
            })
            
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: "Error in changing password"
        })
        
    }

}

        
    
