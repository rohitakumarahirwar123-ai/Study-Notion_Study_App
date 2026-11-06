const Razorpay = require("razorpay");

if (!process.env.RAZORPAY_ID || !process.env.RAZORPAY_SECRET) {
    throw new Error("Razorpay keys are not configured. Set RAZORPAY_ID and RAZORPAY_SECRET in Backend/.env before starting the server.");
}

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});