const express = require("express");
const { login, signin,  changePassword, sendOtp } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");
const { resetPassword, resetPasswordToken } = require("../controllers/ResetPassword");
const router = express.Router();

router.post("/login", login);
router.post("/signup", signin);
router.post("/otp", sendOtp);


router.post("/changepassword",  auth,changePassword);

router.post("/reset-password-token", resetPasswordToken);

router.post("/reset-password", resetPassword);

module.exports = router;