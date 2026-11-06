const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    courseName:{
        type: String,
        required: true,
        trim: true,
    },
    courseDescription:{
        type: String,
        required: true,
        trim: true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    whatYouWillLearn:{
        type: String,
        required: true,
        trim: true,
    },
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReview:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price:{
        type: String,
        required: true,
        trim: true,
    },
    thumbnail:{
        type: String,
        required: true,
        trim: true,
    },
    tag:[String],
    
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    studentEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    
    status:{
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft"
    }

})

module.exports = mongoose.model("Course", courseSchema);