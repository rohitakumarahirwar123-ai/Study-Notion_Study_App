const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async(req, res)=>{
    
    try {
        
        // Data fetch
        const {sectionName, courseId} = req.body;
        
        // Validation
        if(!sectionName || !courseId){
            return res.status(404).json({
                success: false,
                message: "Fill all the fields"
            })
        }

        // Create section
        const newSection = await Section.create({sectionName});

        // Update in course
        const updatedCourse = await Course.findOneAndUpdate({_id: courseId},{
            $push: {courseContent: newSection._id}
        },
        {new: true}).populate({
            path: "courseContent",
            populate:{
                path: "subSection"
            }
        })

        // send response
        res.status(200).json({
            success: true,
            data: updatedCourse,
            message: "Section created successfully"
        })

    } catch (error) {
        console.log("Error occured while creating section: ", error);
        res.status(500).json({
            success: false,
            message: "Creating section failed"
        })
        
    }
}

exports.updateSection = async (req, res) => {
    try {
        // data fetch
        const {sectionName, sectionId} = req.body;

        // validation
        if(!sectionName || !sectionId){
            return res.status(404).json({
                success: false,
                message: "Fill all the fields"
            })
        }

        // update in section db
        const updatedSection = await Section.findOneAndUpdate({_id:sectionId},{sectionName},{new: true}).populate("subSection");

        // return res
        res.status(200).json({
            success: false,
            data: updatedSection,
            message: "Section updated successfully"
        })
        
    } catch (error) {
        console.log("Error occured while updating section: ", error);
         res.status(500).json({
            success: false,
            message: "Updating section failed"
        })
        
    }
}

exports.deleteSection = async(req, res) => {
    try {
        // fetch data
        const {sectionId,courseId} = req.body;
        console.log("Section ID is -> ",sectionId);

        // vlaidation
        if(!sectionId){
            return res.status(404).json({
                success: false,
                message: "Section id is missing"
            })
        }
        // find by id and delete
        const section = await Section.findById(sectionId);

       if(section.subSection && section.subSection.length > 0){
        // delete all sub sections
        await SubSection.deleteMany({_id: {$in: section.subSection}});
       }

        const updatedSection =await Section.findByIdAndDelete(sectionId);
        const updatedCourse = await Course.findOneAndUpdate({_id: courseId},{
            $pull: {courseContent: sectionId}
        },
        {new: true}).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        });


        
        // send response
        res.status(200).json({
            success: true,
            data: updatedCourse,
            message: "Section deleted successfully"
        })
        
    } catch (error) {
        console.log("Error occured while deleting section: ", error);

        res.status(500).json({  
            success: false,
            message: "Deleting  section failed"
        })
        
    }
}