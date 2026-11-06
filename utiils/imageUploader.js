const cloudinary = require("cloudinary").v2;


exports.uploadImageToCloudinary = async(file, folder, height, quality) =>{
    try {
            const options = { folder };
            if (height) {
                options.height = height;
            }
            if (quality) {
                options.quality = quality;
            }
            if (file.mimetype && file.mimetype.startsWith("video/")) {
                options.resource_type = "video";
            }

            const uploaded = await cloudinary.uploader.upload(file.tempFilePath, options);
            return uploaded;
    } catch (error) {
        console.log("Error occured while uploading image: ", error);
        throw error;
    }
}
