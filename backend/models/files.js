import mongoose from "mongoose";
import { BSON, Timestamp } from "bson";

const FileSchema = new mongoose.Schema({
    fileName:{
        type: String,
    },
    fileData:{
        type: Buffer,  //stores object as a buffer, should allow for file storage
    },
    fileType:{
        type: String,
    },

    fileSize: {
        type: Number,
    }, 
},
{timestamps: true});

const File = mongoose.model("File", FileSchema);

export default File;