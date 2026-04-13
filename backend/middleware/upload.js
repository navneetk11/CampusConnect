//multer middleware to allow for easier easier file interactions on upload
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits:{
        fileSize: 8388608,
    },
    fileFilter: (req, file, cb) =>{                                                        //linux and windows zip MIME types(As per MDN)
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "text/plain", "application/zip", "application/x-zip-compressed"];

        if(!allowedTypes.includes(file.mimetype)){
            console.log(file.mimetype);
            return cb(new Error("Invalid File Type"), false);
        }
        return cb(null, true);
    }
});

export default upload;