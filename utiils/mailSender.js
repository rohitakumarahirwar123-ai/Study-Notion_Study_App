const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465,
    secure: process.env.MAIL_PORT ? process.env.MAIL_PORT === "465" : true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    debug: false,

})

async function sendMail(email, title, body){
    try {
        const info =await transporter.sendMail({
        from: `${process.env.FOLDER_NAME || 'StudyNotion'} <${process.env.MAIL_USER}>`,
        to: email,
        subject: title,
        html : body,
    })
            return info;
        
    } catch (error) {
        console.error("Error occured while sending mail:", error);
        throw error;
    }
    
}

module.exports = sendMail;
