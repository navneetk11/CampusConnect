import Group from "../models/groups.js";
import User from "../models/users.js";
import mongoose from "mongoose";

/* CREATE GROUP */

export const createGroup = async (req, res) => {
  try {

    const { title, courseCode, department, mode, leader, members, location } = req.body;

    if (!title || !courseCode || !department || !mode || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields"
      });
    }

    const leaderUser = await User.findOne({ username: leader});

    if (!leaderUser) {
      return res.status(404).json({
        success: false,
        message: "Leader not found"
      });
    }

    const uid = leaderUser._id;

    const newGroup = new Group({
      title,
      courseCode,
      department,
      mode,
      leader: uid,
      members: [uid] || [],
      location: location || []
    });

    await User.findByIdAndUpdate(
      uid,
      { $addToSet: { groups: newGroup.id}},
      {new: true}
    );

    await newGroup.save();

    res.status(201).json({
      success: true,
      data: newGroup
    });

  } catch (error) {

    console.error("Error in Create Group:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};


/* SEARCH GROUPS */

export const searchGroups = async (req, res) => {
  try {

    const { courseCode, department, mode } = req.query;

    let filter = {};

    if (courseCode) {
      filter.courseCode = courseCode;
    }

    if (department) {
      filter.department = department;
    }

    if (mode) {
      filter.mode = mode;
    }

    const groups = await Group.find(filter);

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });

  } catch (error) {

    console.error("Error in searchGroups:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};


/* JOIN GROUP */

export const joinGroup = async (req, res) => {
  try {

    console.log("Group ID received:", req.params.groupId);

    const groupId = req.params.groupId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const group = await Group.findById(groupId);
    console.log("Group found:", group);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const alreadyMember = group.members.some(
      (member) => member.toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User already in group"
      });
    }

    await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { groups: groupId}},
      {new: true}
    );

    res.status(200).json({
      success: true,
      message: "Joined successfully",
      groupId: group._id,
      memberCount: group.members.length
    });

  } catch (error) {

    console.error("JoinGroup ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* LEAVE GROUP */

export const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ success: false, message: "Invalid groupId" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    // Cast both to ObjectId so $pull matches correctly against the stored ObjectIds
    const userObjId  = new mongoose.Types.ObjectId(userId);
    const groupObjId = new mongoose.Types.ObjectId(groupId);

    const group = await Group.findById(groupObjId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }

    // Leaders cannot leave — they must delete the group or transfer ownership first
    if (group.leader.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Group leader cannot leave. Delete the group instead."
      });
    }

    const isMember = group.members.some(
      (member) => member.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this group"
      });
    }

    // Remove userId from group.members
    await Group.findByIdAndUpdate(
      groupObjId,
      { $pull: { members: userObjId } },
      { new: true }
    );

    // Remove groupId from user.groups
    await User.findByIdAndUpdate(
      userObjId,
      { $pull: { groups: groupObjId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Left group successfully"
    });

  } catch (error) {

    console.error("leaveGroup ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* GET ALL GROUPS */

export const getGroups = async (req, res) => {
  try {

    const groups = await Group.find({});

    res.status(200).json({
      success: true,
      data: groups
    });

  } catch (error) {

    console.error("Error in getGroups:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server error"
    });

  }
};

export const getGroupByID = async(req, res) =>{
    const {id} = req.params;
    try{
        const groupData = await Group.findById(id);
        if(!groupData){
            return res.status(400).json({success: false, message: "Group not found"});
        }
        console.log(groupData);
        return res.status(200).json({success: true,  _id: groupData._id, title: groupData.title, courseCode: groupData.courseCode,
          leader: groupData.leader, members: groupData.members, mode: groupData.mode, location: groupData.location
         });    
    }
    
    catch(error){
        return res.status(500).json({success: false, error: error.message});
    }
}