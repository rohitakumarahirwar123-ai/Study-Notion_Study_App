const jwt = require("jsonwebtoken");
require("dotenv").config();


// auth
exports.auth = async(req, res, next) => {
    try {

         let token = req.body?.token || req.cookies?.token ||  req.header("Authorization")?.replace("Bearer ", "") ;
        
        if (token === "undefined" || token === "null") {
            token = null;
        }
        // Validate token
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token not found"
            })
        }

        // Decode token using  jwt
        const decode = jwt.verify(token, process.env.TOKEN_PASS);
        req.user = decode;
        

    } catch (error) {
        console.log("Error occured in Auth middleware: ", error.message);
        return res.status(401).json({
            success: false,
            message: "Error occured in Auth middleware"
        })
        
    }
    next();
   
}

// isStudent
exports.isStudent = async (req,res,next) => {
    try {
        console.log(req.user.accountType);
        if(req.user.accountType !== "Student"){
            console.log("Error occured in isStudent middleware: user is not a student");
            return res.status(403).json({
                success: false,
                message: "Error occured in  is student"
            })
        }
    } catch (error) {
         console.log("Error occured in Auth middleware: ", error.message);
        return res.status(401).json({
            success: false,
            message: "Error occured in Auth middleware"
        })
        
    }
    next();

}

// isInstructor
exports.isInstructor = async (req,res,next) => {
    try {
        console.log("Request ko print kara rahe",req.user);
        if(req.user.accountType !== "Instructor"){
                return res.status(403).json({
                    success: false,
                    message: "Error occured in isInstructor middleware"
                })
        }
    } catch (error) {
            console.log("Error occured in isInstructor middleware: ", error.message);
            return res.status(401).json({
                success: false,
                message: "Error occured in isInstructor middleware"
            })
            
    }
    next();

}


// isAdmin
exports.isAdmin = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            console.log("Error occured in isAdmin middleware: user is not an admin");
            return res.status(403).json({
                success: false,
                message: "Error occured in is Admin"
            })
        }
    } catch (error) {
         console.log("Error occured in isAdmin middleware: ", error.message);
            return res.status(401).json({
                success: false,
                message: "Error occured in isAdmin middleware"
            })
        
    }
    next();

}
