const crypto = require("crypto");
const {instance} = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const mailSender = require("../utiils/mailSender");

exports.capturePayment = async(req, res) => {
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0){
        return res.json({success: false, message:"Pls provide course id"});
        }
    
        let totalAmount = 0;

        for(const courseItem of courses){
            let course;
            try {
                const courseId = typeof courseItem === "string"
                    ? courseItem
                    : courseItem?.courseId || courseItem?.course_id || courseItem?._id;

                if (!courseId) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid course id"
                    });
                }

                course = await Course.findById(courseId);
                if(!course){
                    return res.status(200).json({
                        success: false,
                        message: "Could not find the course"
                    });
                }

                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentEnrolled.includes(uid)){
                    return res.status(200).json({
                        success: false,
                        message: "Student already enrolled"
                    });
                }

                totalAmount += Number(course.price || 0);

            } catch (error) {
                console.log(error.message);
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }

            const options = {
                amount : totalAmount*100,
                currency: "INR",
                receipt : Math.random(Date.now()).toString()
            }

            try {
                const paymentResponse = await instance.orders.create(options);
                 return res.json({
                    success: true,
                    message: paymentResponse,
                    key: process.env.RAZORPAY_ID,
                })
            } catch (error) {
                console.log(error.message);
                return res.status(500).json({
                    success : false,
                    message: "Error occured while creating order",
                })
                
            }
        }
}

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnroled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}

// exports.capturePayment = async(req, res) => {
//     const {courseId} = req.body;
//     const userId = req.user.id;

//     // Validation
//     try {
//         const course = await Course.findById(courseId);
//         const user = await User.findById(userId);
//         if(!course){
//             return res.status(401).json({
//                 success: false,
//                 message: "No course found"
//             })
//         }

//         if(!user){
//             return res.status(401).json({
//                 success: false,
//                 message: "No user found"
//             })
//         }
//         const uid = new mongoose.Types.ObjectId(userId);
//          if(course.studentEnrolled.includes(uid)){
//                 return res.status(403).json({
//                     success: false,
//                     message: "User already enrolled in course"
//                 })
//     }
//       const amount = course.price

//         const options = {
//             amount: amount*100,
//             currency: "INR",
//             receipt: Math.random()*Date.now().toString(),
//             notes: {
//                 courseId: courseId,
//                 userId: userId
//             }
//         }
//         const paymentResponse = await instance.orders.create(options);    
//         console.log(paymentResponse);
        
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.description,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount
//         })
        
//     } catch (error) {
//         console.log("Error occured in creating order: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error occured while finding course and user in create order"
//         })
        
//     }

  
// }

// // Verify signature of razorpay and server

// exports.verifyPayment = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");
//     if(signature === digest){
//         console.log("Payment is Authorised")


//         try {
//             const {courseId, userId} = req.body.payload.payment.entity.notes;

//             if(!courseId || !userId){
//                 res.status(404).json({
//                     success: false,
//                     message: "Data not found"
//                 })
//             }

//             const updatedCourse = findOneAndUpdate(
//                 {_id: courseId},
//                 {
//                     $push:{studentEnrolled :userId}
//                 },
//                 {new: true}
//             )

//             const updatedUser = findOneAndUpdate(
//                 {_id: userId},
//                 {
//                     $push: {courses: courseId}
//                 },
//                 {new: true}
//             )

//             const mailResponse = await mailSender(
//                 updatedUser.email,
//                 "Congratulations from codehelp",
//                 `Your Purchase successfully : ${updatedCourse.name}`

//             )

//             res.status(200).json({
//                 success: true,
//                 message: "Course Purchased successfully"
//             })
            
//         } catch (error) {
//             console.log("Error occured while verifying signature: ", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Error occured"
//             })
            
//         }
//     }
// }