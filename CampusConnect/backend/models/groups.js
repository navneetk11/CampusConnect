import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    courseCode: { type: String, required: true },
    leader: {type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  department: {
  type: String,
  enum: ["School of the Arts, Media, Performance & Design", "Faculty of Education", "Faculty of Environmental & Urban Change", 
      "Glendon College" , "Faculty of Graduate Studies" , "Faculty of Health" , "Faculty of Liberal Arts & Professional Studies",
      "Lassonde School of Engineering","Faculty of Science","Schulich School of Business"],
  required: true
},
 mode: {
  type: String,
  enum: ["virtual", "inperson"],
  required: true
},
location: {
  type: String,
  enum: ["Catholic Education Center", "Glendon", "Keele", "Markham", "Off Campus", "Seneca at York", 
      "Toronto Metropolitan University"],
  required: true
},

  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;