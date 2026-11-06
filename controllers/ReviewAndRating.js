const RatingAndReview = require("../models/RatingAndReview");
const mongoose = require("mongoose")
const User = require("../models/User");
const Course = require("../models/Course");

exports.createRating = async (req, res) => {
    try {
        const { courseId, review, rating } = req.body;
        const userId = req.user.id;
        console.log("createRating", courseId, review, rating, userId);

        if (!courseId || !review || !rating) {
            return res.status(400).json({
                success: false,
                message: "courseId, review, and rating are required"
            });
        }

        const courseDetail = await Course.findOne({
            _id: courseId
        });
        console.log(courseDetail)
        if (courseDetail.studentEnrolled.includes(userId) === false) {
            return res.status(400).json({
                success: false,
                message: "You must purchase the course before leaving a review"
            });
        }

        const userReviewed = await RatingAndReview.findOne({ user: userId, course: courseId });
        if (userReviewed) {
            return res.status(409).json({
                success: false,
                message: "User already reviewed the course"
            });
        }


        const newRatingAndReview = await RatingAndReview.create({
            course: courseId,
            user: userId,
            rating,
            review
        });

        await Course.findByIdAndUpdate(
            courseId,
            { $push: { ratingAndReview: newRatingAndReview._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Rating and review submitted successfully"
        });
    } catch (error) {
        console.log("Error occured while creating rating and review: ", error);
        return res.status(500).json({
            success: false,
            message: "Rating and review creation failed",
            error: error.message
        });
    }
}

// Get Average Rating
exports.getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "courseId is required"
            });
        }

        const ratings = await RatingAndReview.find({ course: courseId }).select("rating");
        if (!ratings || ratings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No rating exist"
            });
        }

        const averageRating = await RatingAndReview.aggregate([
    {
        $match: {
            course: courseId  
        }
    },
    {
        $group: {
            _id: null,
            averageRating: { $avg: "$rating" }
        }
    }
]);
        console.log(averageRating);
        return res.status(200).json({
            success: true,
            data: averageRating,
            message: "Average rating found"
        });
    } catch (error) {
        console.log("Error occured in review and rating avg: ", error);
        return res.status(500).json({
            success: false,
            message: "Error occured in review and rating",
            error: error.message
        });
    }
}


// Get all rating and review
exports.getAllRatingAndReview = async (req, res) => {
    try {
        const data = await RatingAndReview.find({})
            .sort({ rating: -1 })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName"
            })
            .exec();
        res.status(200).json({
            success: true,
            data,
            message: "All rating and review data"
        });
    } catch (error) {
        console.log("Error occured in rating and review: ", error);
        return res.status(500).json({
            success: false,
            message: "Error occured",
            error: error.message
        });
    }
}