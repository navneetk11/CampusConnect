import mongoose from "mongoose"
import Course from "../models/courses.js"
export const getCourseInfo = async(req, res) =>{
    const {id} = req.params;
    try{
        const courseData = await Course.findById(id);
        if(!courseData){
            return res.status(400).json({success: false, message: "Course not found"});
        }
        console.log(courseData);
        return res.status(200).json({success: true, name: courseData.name, courseCode: courseData.courseCode});    
    }
    
    catch(error){
        return res.status(500).json({success: false, error: error.message});
    }
}