import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    date: { 
      type: String, 
      required: true 
    },
    time: { 
      type: String, 
      required: true 
    },
    location: { 
      type: String, 
      required: true 
    },
    mode: { 
      type: String, 
      enum: ["virtual", "inperson"], 
      required: true 
    },
    meetingLink: {
      type: String,
      default: ""
    },
    groupId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Group", 
      required: true 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    available_students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;