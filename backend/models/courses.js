import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
    courseCode:{
        type: String,
        require: true,
        unique: true,
    },
    name:{
        type: String,
        require: true,
        unique: true,
    },

    }//timestamps not necessary for this since it is mostly static
)
const Course = mongoose.model("Course", CourseSchema); 

export default Course;