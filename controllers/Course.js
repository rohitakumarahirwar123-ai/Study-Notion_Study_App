const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utiils/imageUploader");
const Category = require("../models/Category");
require("dotenv").config();

exports.createCourse = async(req, res) => {
    console.log("Course created successfully;")
    try {
         // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }

         // fetch data and files from req.body
        const {courseName, courseDescription, whatYouWillLearn, price, category,tags, instructions} = req.body
        const thumbnail = req.files?.thumbnail;
        console.log("TITLE",courseName);

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "Fill all details"
            })
        }

        //category ki validation karlo ji
        const existCategory = await Category.findOne({name :category});
        if(!existCategory){
            return res.status(404).json({
                success: false,
                message: "category is invalid"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        const thumbnailUrl = thumbnailImage.secure_url

        // Fetch instructor id to update data in user
        const userId = req.user.id;

        // create course in db
        const course = await Course.create({
            courseName,
            courseDescription, 
            whatYouWillLearn,
            price, 
            thumbnail: thumbnailUrl,
            category: existCategory._id,
            instructor: userId
        })

        // Update user(instructor) in db
        await User.findOneAndUpdate({_id: userId},{
            $push:{courses: course._id}
        },{new: true})

        // Update category in db
        await Category.findOneAndUpdate({_id: existCategory._id},{
            $push: {courses: course._id}},
            {new: true}
        )
        
        // return response
        res.status(200).json({
            success: true,
            data: course,
            message: "Course created successfully"
        })
            
    } catch (error) {
        console.log("Error occured while creating a course: ", error);
        return res.status(500).json({
                success: false,
                error: error.message,
                message: "Error occure in create course"
            })
        
    }
   


}

// Get all courses
exports.getAllCourses =  async (req,res) => {
    try {
        const allCourses = await Course.find({});
        res.status(200).json({
            success: true,
            data:allCourses,
            message: "All courses data fetched"
        })

    } catch (error) {
        console.log("Error occured while fetching courses: ", error);
        res.status(500).json({
            success: false,
            message: "Error occured while fetching courses"
        })
        
    }
}

// Get course details
exports.getCourseDetail = async (req, res) =>{
    try {
        
        const courseId = req.body.courseId;
        const userId = req.user.id;

        console.log("GetCourseDetail",req.body.courseId);
        
        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        });
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if(!course?.studentEnrolled?.includes(userId)){
            console.log("User did not enroll in course");
            return res.status(404).json({
                success: false,
                message: "User did not enroll in course"
            })
        }

        res.status(200).json({
            success: true,
            data: course,
            message: "Course fetched successfully"
        })

    } catch (error) {
        console.log("Error occured while fetching course details:", error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error occured "
        })

        
    }
}

exports.publishCourse = async (req, res) => {
    try {
        const {courseId} = req.body;
        const course = await Course.findByIdAndUpdate(courseId, {status: "Published"}, {new: true});
        res.status(200).json({
            success: true,
            data: course,
            message: "Course published successfully"
        });
    } catch (error) {
        console.log("Error occured while publishing course:", error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error occured while publishing course"
        })
    }
}

exports.instructorCourse = async(req,res)=>{
    const instructorId = req.user.id;
    console.log("USER ->>>",instructorId)
    try{
        const courses = await Course.find({instructor: instructorId})
        res.status(200).json({
            success: true,
            message: "My COurses data",
            data: courses,
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Issue in instructor courswe Bachend"
        })

    }
}

exports.deleteCourse = async(req,res)=>{
    try {
        console.log("Delete request body:", req.body);
        const courseId = req.body?.courseId || req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        console.log("Course ID to delete:", courseId);
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            data: deletedCourse
        });
    } catch (error) {
        console.log("Error occured while deleting course:", error.message);
        res.status(500).json({
            success: false,
            message: "Error occured while deleting course"
        });
    }
}

