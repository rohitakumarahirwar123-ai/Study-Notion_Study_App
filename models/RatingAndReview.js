const mongoose = require("mongoose");

const ratingAndReview = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    rating:{
        type: String,
        required: true,
        trim: true,
    },
    review:{
        type: String,
        required: true,
        trim: true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
})

module.exports = mongoose.model("RatingAndReview", ratingAndReview);