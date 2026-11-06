const ContactUs = require("../models/Contactus");

exports.Contact = async(req, res) => {
const {firstName,lastName,phoneNo, email, message, code} = req.body ;

    if(!firstName || !lastName || !phoneNo || !email || !message || !code){
        console.log("Missing Data")
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const phoneNumber = code + phoneNo;

    try {
        const response = await ContactUs.create({
            firstName,
            lastName,
            phoneNo: phoneNumber,
            email,
            message,
            
        })
        return res.status(200).json({
            success: true,
            message: "Response send successfully",
            data: response
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Error in Contact us controller"
        })
        
    }
}
