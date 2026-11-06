const mongoose = require("mongoose");

const ContactusSchema = mongoose.Schema({
    firstName:{
        type: String,
        trim: true,
        required: true
    },
    lastName:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    phoneNo:{
        type: Number,
        trim: true,
        required: true
    },
    message:{
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model("ContactUs", ContactusSchema);