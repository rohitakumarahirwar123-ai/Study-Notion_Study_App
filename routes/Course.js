const express = require("express");
const { createCourse, getAllCourses, getCourseDetail ,publishCourse, instructorCourse,deleteCourse} = require("../controllers/Course");
const {auth, isStudent, isInstructor, isAdmin} = require("../middlewares/auth");
const { createCategory, getAllCategory, categoryPageDetails } = require("../controllers/Category");
const { createRating, getAverageRating, getAllRatingAndReview } = require("../controllers/ReviewAndRating");
const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection");
const router = express.Router();

// Import all course related controller

router.post("/createCourse",auth, isInstructor, createCourse);
router.get("/myCourse",auth,isInstructor,instructorCourse)
router.get("/getAllCourse", getAllCourses);
router.post("/getCourseDetail",auth,isStudent, getCourseDetail);
router.put("/publishCourse",auth, isInstructor, publishCourse);
router.delete("/deleteCourse",auth, isInstructor, deleteCourse);

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/getAllCategory", getAllCategory);
router.post("/categoryPageDetails", categoryPageDetails); 

router.post("/createRating", auth,  createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatingAndReview", getAllRatingAndReview);

router.post("/createSection",auth, isInstructor, createSection);
router.put("/updateSection",auth, isInstructor, updateSection);
router.delete("/deleteSection",auth, isInstructor, deleteSection);

router.post("/createSubSection",auth, isInstructor, createSubSection);
router.put("/updateSubSection",auth, isInstructor, updateSubSection);
router.put("/publishCourse",auth, isInstructor, publishCourse);
router.delete("/deleteSubSection",auth, isInstructor, deleteSubSection);






module.exports = router;