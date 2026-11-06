const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
require("dotenv").config();
const { uploadImageToCloudinary } = require("../utiils/imageUploader");

exports.createSubSection = async(req, res) => {
    
    try {
         // Fetch data and file
         const {title, description, timeDuration, sectionId} = req.body;
         const video = req.files?.videoFile || req.files?.video || req.body.videoFile || req.body.video;

        // validation
        if(!title || !description || !timeDuration || !video || !sectionId){
            return res.status(404).json({
                success: false,
                message: "Field data is missing"
            })
        }

        // upload a video
        const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        if (!uploadedVideo?.secure_url) {
            return res.status(500).json({
                success: false,
                message: "Video upload failed"
            })
        }
        const videoUrl = uploadedVideo.secure_url

        // create a subSection
        const newSubsection = await SubSection.create({ title, timeDuration, description, videoUrl })

        // update section
        const updatedSection = await Section.findOneAndUpdate(
            {_id: sectionId},
            {
                $push:{subSection: newSubsection._id}
            },
            {returnDocument: 'after'}
        ).populate("subSection")

        // send response
        res.status(200).json({
            success: true,
            data: updatedSection,
            message: "Sub section created"
        })
        
    } catch (error) {
        console.log("Error occured in creating sub section: ", error)
        res.status(500).json({
            success: false,
            message: "Creating sub section failed"
        })
        
    }
  
}

exports.updateSubSection = async(req,res) => {
    try {
        
        // fetch data
        const {title, description, timeDuration, subSectionId} = req.body;
        const video = req.files?.videoFile || req.files?.video || req.body.videoFile || req.body.video;

        // Validation
        if(!subSectionId){
            return res.status(404).json({
                success: false,
                message: "Id is empty"
            })
        }

        const updatePayload = {}
        if (title) updatePayload.title = title
        if (description) updatePayload.description = description
        if (timeDuration) updatePayload.timeDuration = timeDuration
        if (video) {
            const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
            if (!uploadedVideo?.secure_url) {
                return res.status(500).json({
                    success: false,
                    message: "Video upload failed"
                })
            }
            updatePayload.videoUrl = uploadedVideo.secure_url
        }

        // Find and update
        const updatedSubSection = await SubSection.findOneAndUpdate(
            {_id: subSectionId},
            updatePayload,
            {returnDocument: 'after'}
        )

        // send response
        res.status(200).json({
            success: true,
            data: updatedSubSection,
            message: "Updated successfully"
        })
        
    } catch (error) {
        console.log("Error occured in updating a sub section: ", error)
        res.status(500).json({
            success: false,
            message: "Updating sub section failed"
        })
        
        
    }
}


exports.deleteSubSection = async (req, res) => {
    try {
        const {subSectionId,sectionId} = req.body;
        const updatedSection = await Section.findOneAndUpdate(
            {_id: sectionId},
            {$pull: {subSection: subSectionId}},
            {new: true}
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        });
        await SubSection.deleteOne({_id: subSectionId});
        res.status(200).json({
            success: true,
            message: "Deleting subsection successfully"
        })
        

    } catch (error) {
         console.log("Error occured in deleting sub section: ", error)
            res.status(500).json({
                success: false,
                message: "deleting sub section failed"
            })
        
    }

}
