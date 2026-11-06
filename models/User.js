const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    accountType:{
        type: String,
        required: true,
        enum:["Student","Instructor", "Admin"],
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
    image:{
        type: String,
        required: true,
        trim: true,
    },
    courseProgress:{
        type: mongoose.Schema.Types.ObjectId ,
        ref: "courseProgress"

        
    },
    token:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date,

    }
    

})

module.exports = mongoose.model("User", userSchema);