const mongoose = require("mongoose");
const sendMail = require("../utiils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 10*60,
    },
    otp:{
        type: String,
        required: true,
    }
})

async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse =   await sendMail(email,"Verification message",otpTemplate(otp));
        console.log("Email sent successfully....");
    } catch (e) {
        console.log("error occured in sending email: ", e.message);
        
    }
        
}

OTPSchema.pre("save", async function () {
    await sendVerificationEmail(this.email,this.otp);
   
} )

module.exports = mongoose.model("OTP", OTPSchema);