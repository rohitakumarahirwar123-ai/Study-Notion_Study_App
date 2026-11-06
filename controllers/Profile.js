// Updating profile
const { populate } = require("dotenv");
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth, about, contactNumber, gender } = req.body;
        const userId = req.user.id;

        if (!dateOfBirth || !about || !contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existUser = await User.findById(userId);
        if (!existUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const profileId = existUser.additionalDetails;
        if (!profileId) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.log("Error occured while Updating profile: ", error);
        res.status(500).json({
            success: false,
            message: "Error occured while updating profile"
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const existUser = await User.findById(userId);
        if (!existUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (existUser.additionalDetails) {
            await Profile.deleteOne({ _id: existUser.additionalDetails });
        }

        const deletedUser = await User.deleteOne({ _id: userId });

        res.status(200).json({
            success: true,
            data: deletedUser,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log("Error occured while deleting profile: ", error.message);
        res.status(500).json({
            success: false,
            message: "Error occured while deleting profile"
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findById(userId).populate("additionalDetails");

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: userDetails,
            message: "User data fetched successfully"
        });
    } catch (error) {
        console.log("Error occured while fetching user details: ", error);
        return res.status(500).json({
            success: false,
            message: "Error occured"
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        
        const userId = req.user.id;
        
        const course = await User.findById(userId).select("courses").populate({
            path : "courses",
            populate:{
                path: "courseContent"
            }
        });
        


        if (!course || !course.courses || course.courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No course found"
            });
        }

        res.status(200).json({
            success: true,
            data: course,
            message: "Courses data fetched successfully"
        });
    } catch (error) {
        console.log("Error occured while fetching course details: ", error);
        return res.status(500).json({
            success: false,
            message: "Error occured"
        });
    }
};
