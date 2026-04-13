import File from "../models/files.js";
import { Binary } from "bson";
import fs from "fs";


//File Upload function
export const fileUpload = async(req, res) => {

    try {
        //get file
        if(!req.file){
            return res.status(400).json({success: false, message: "No file uploaded"});
        }
        const file = req.file;
        //get FileName 
        var name = file.originalname; //regex to get fileName w/ extension
        
        //turn into Binary Data / Buffer
        const fData = file.buffer
        
        //metadata
        var fType = file.mimetype.split('/').pop(); 
        const size = file.size; //size in bytes

        const upload = {fileName: name, fileData: fData, fileType: fType, fileSize: size};
        const newFile = new File(upload);
        await newFile.save();
        return res.status(201).json({success: true, file: newFile});
        
        
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
} 

//File download function
export const fileDownload = async(req, res) => {

    const {fileId} = req.params;
    try{
        //find file in DBs
        
        const file = await File.findById(fileId);
        if(file.fileType == 'plain'){
            res.set({"Content-Type": file.fileType, "Content-Disposition": `attachment; filename=${file.fileName}.txt`});
        }
        //Download file to user through browser functionality
        res.set({"Content-Type": file.fileType, "Content-Disposition": `attachment; filename=${file.fileName}.${file.fileType}`});
        res.status(200).send(file.fileData);
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const fileDelete = async(req,res) => {
    try{
    const {fileId} = req.params;
    console.log(fileId);
    await File.findOneAndDelete({_id: fileId}); 
    return res.status(200).json({success: true, message: "File deleted"});
}
    catch(error){
    return res.status(500).json({success: false, message: error.message});
}
}