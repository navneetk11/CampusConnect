import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import groupRoutes from "./routes/group.route.js";
import sessionRoutes from "./routes/session.route.js";
import courseRoutes from "./routes/course.route.js";
import fileRoutes from "./routes/file.route.js"
import messageRoutes from './routes/message.route.js';
  
import cors from 'cors';

dotenv.config();

//nodemon allows active preview of updates when a file is updated, instantly restarting the server
//use this functionality when testing to preview changes made locally work before submitting a PR
const app = express();


const PORT = process.env.PORT || 5000;

app.use(express.json()); //allows parsing of json data 

//Cross Origin Resource Sharing Policy
app.use(cors({
    origin: 'http://localhost:5173', //replace with your host port
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true, 

}));




app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/files", fileRoutes)
app.use("/api/messages", messageRoutes); 

//starts the server, for development and testing purposes right now
app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

