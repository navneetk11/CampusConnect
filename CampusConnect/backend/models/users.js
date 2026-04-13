import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    year: 
    {
        type: String, default: "Not Assigned"
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: []
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: []
    }]
}, { timestamps: true //Timestamps when fields are created and updated
});

const User = mongoose.model('User', userSchema);

export default User;
