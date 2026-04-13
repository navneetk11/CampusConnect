/* Controller to handle user related functions for our database */
import mongoose from "mongoose";
import User from "../models/users.js";
import bcrypt from "bcryptjs"; // password hashing
import Course from "../models/courses.js";
import jwt from "jsonwebtoken";


// GET USER BY ID
export const getUserbyId = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"User Not Found"})
    }
    try {
        const user = await User.findById(id);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// SIGNUP / ADD USER
export const addUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ username });

    try {
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword });
            await newUser.save();
            const token = jwt.sign(
    { id: newUser._id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);

res.status(201).json({
    success: true,
    token,
    user: {
        id: newUser._id,
        username: newUser.username
    },
    message: "User created successfully"
});
        } else {
            res.status(409).json({ success: false, message: "Username already in use" });
        }
    } catch (error) {
        console.error("Error in Create User:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// LOGIN USER
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide username and password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // CREATE TOKEN
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username
            },
            message: "Login successful"
        });

    } catch (error) {
        console.error("Error in Login User:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"User Not Found"});
    }
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User successfully deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET ALL USERS
export const getUsers = async(req, res) =>{
    try{
        const users = await User.find({}, 'username');
        const usernames = users.map((user) =>user.username);
        res.status(200).json({success: true, data: usernames});
    } catch(error){
        console.error("Error getting users:",error.message);
        res.status(500).json({success: false, message:"Internal Server Error"});
    }
};

// Edit Year
export const editYear = async(req,res) => {
    try{
     const {id} = req.params;
        const year = req.body;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        if(!year){
            return res.status(400).json({success: false, message: "Please select your year of study"});
        }
        user.year = year.year;
        await user.save();
        return res.status(200).json({success: true, message: "Year updated!"});
    }
    catch(error){
        return res.status(500).json({success:false, message: error.message});
    }
}

//Update User's username, or password (or both)
export const updateUserPass = async(req, res) => {
  try{
        const {id} = req.params;
        const {username, password} = req.body;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({success: false, message: "User not Found"});
        }
        const existingUser = await User.findOne({username: username});
        if(username){
            if(existingUser){
                return res.status(400).json({success: false, message: "A user with that name already exists, pick a different name"});
            }
            user.username = username;
        }
        if(password){
            user.password = await bcrypt.hash(password, 10); //ensuring PW is hashed properly before moving on
        }
        await user.save();
        res.status(200).json({success: true, message: "User successfully modified!"});
    }
    catch(error){
        return res.status(500).json({success: false, error: error.message});
    }
}

//Add a Course
  export const addCourse = async(req, res) => {
   try{
        const{id} = req.params;
        const {courseCode} = req.body;
        
        const user = await User.findById(id);
    if(!user){
        return res.status(404).json({success:false, message:"User not found"});
    }
    //find course in DB
    const course = await Course.findOne({courseCode: courseCode});
    if(!course){
        return res.status(404).json({success:false, message: "Invalid course"});
    }
    var isAdded = await User.findOne({_id: id, courses: course.id});
    //if course in user.courses
    if(isAdded){
        return res.status(400).json({success: false, message: "Course already added"});
    }
    user.courses.push(course.id);
    await user.save();
    return res.status(201).json({success: true, message: "Course added successfully"});
  }
  catch(error){ 
    return res.status(500).json({success:false, error: error.message});
  }
}

export const deleteCourse = async(req,res) =>{
    try{
    const {id} = req.params;
    const {courseCode} = req.body
    

    const user = await User.findById(id);

    if(!user){
        
        return res.status(404).json({success: false, message: "User not found"});
    }

    const course = await Course.findOne({courseCode: courseCode});

    if(!course){
        return res.status(404).json({success: false, message: "Course not found"});
    }

    const inCourseList = await User.findOne({_id: user.id, courses: course.id})

    if(!inCourseList){
        return res.status(404).json({success: false, message: "Course not in course list"});
    }

    const courses = user.courses;

    
    const index = courses.indexOf(course.id);
    if(index > -1){
        user.courses.splice(index, 1);
    }
    await user.save();
    
    return res.status(200).json({success: true, message: "Course deleted from User"});
    }
catch(error){
    return res.status(500).json({success: false, message: error.message})
}
}
