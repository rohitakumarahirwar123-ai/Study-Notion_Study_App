const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async(req,res) => {
    try {
        
        // Fetch data from req body
        const {name,description} = req.body;

        // validation
        if(!name || !description){
            return res.status(404).json({
                success: false,
                message: "Fill all your details"
            })
         }

        // create a category in db
        const category = await Category.create({name:name, description:description})

        res.status(200).json({
            success: true,
            message: "Category created successfully"
        })

    }catch (error) {
        console.log("Error occured in category creation: ", error);
        res.status(500).json({
            success: false,
            message: "Error occured during category creation"
        })
    }
}

exports.getAllCategory = async(req,res) => {

    try {
        // get all category
        const allCategory = await Category.find({}, {name:true, description:true});
        
        res.status(200).json({
            success: true,
            data: allCategory,
            message: "All category are fetched"
        })
        
    } catch (error) {
            console.log("Error occured during category fetching: ", error);
        res.status(500).json({
            success: false,
            message: "Error occured during fetching category"
        })
        
    }
}

    

// Category page details
exports.categoryPageDetails = async (req,res) => {
    try {
        const categoryId = req.body.categoryId;

        console.log("categoryID->",categoryId);
        if(!categoryId) {
            return res.status(400).json({
                success: false,
                message: "categoryId is required"
            });
        }

        // get course details
        const selectedCategory = await Category.findOne({_id: categoryId}).populate("courses");
        
        // validation
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Data not found"
            })
        }

        // Get courses for different categories
        const differentCategory = await Category.find(
            { _id: { $ne: categoryId } }
        ).populate("courses").exec()

        // get top selling courses
        const topSellingCourses = await Course.aggregate([
            {
                $addFields: {
                    totalEnrolled: { $size: "$studentEnrolled" }
                }
            },
            {
                $sort: { totalEnrolled: -1 }
            },
            {
                $limit: 5
            }
        ])

        // response return
        return res.status(200).json({
            success: true,
            message: "Category page details -->",
            data:{
                selectedCategory,
                differentCategory,
                topSellingCourses
            }
        })

        
    } catch (error) {
        console.log("Error occured while fetching category page detail: ", error)
        return res.status(500).json({
            success: false,
            message: "Error occured"
        })
        
    }

}

