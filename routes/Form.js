const express = require("express");
const { Contact } = require("../controllers/ContactUs");
const router = express.Router();

router.post("/contactus",Contact)

module.exports = router