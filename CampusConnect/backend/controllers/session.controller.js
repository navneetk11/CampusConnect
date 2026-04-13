import Session from "../models/sessions.js";
import Group from "../models/groups.js";
import mongoose from "mongoose";
import User from "../models/users.js";

/* CREATE SESSION */
export const createSession = async (req, res) => {
  try {
    const { title, date, time, location, mode, meetingLink, groupId, createdBy } = req.body;

    if (!title || !date || !time || !location || !mode || !groupId || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID"
      });
    }

    const group = await Group.findById(groupId); //prevent creating session for fake groups
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }

    const newSession = new Session({
      title, date, time, location, mode, meetingLink: meetingLink || "", groupId, createdBy, available_students: [createdBy] || []
    });

    await newSession.save();

    res.status(201).json({
      success: true,
      data: newSession,
      message: "Session created successfully"
    });

  } catch (error) {
    console.error("Error in createSession:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

/* GET SESSIONS BY GROUP */
export const getSessionsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID"
      });
    }

    const sessions = await Session.find({ groupId });

    res.status(200).json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error("Error in getSessionsByGroup:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

/* JOIN SESSION */
export const joinSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({success: false, message: "userId is required"});
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({success: false, message: "Session not found"});
    }
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }

    const alreadyAvailable = session.available_students.some(
      (member) => member.toString() === userId.toString()
    );

    if (alreadyAvailable) {
      return res.status(400).json({success: false, message: "User already joined session"});
    }

    await Session.findByIdAndUpdate(
      sessionId,
      { $addToSet: {available_students: userId} },
      { new: true}
    );

    res.status(200).json({
      success: true,
      message: "Joined successfully",
      sessionId: session._id,
    });

  } catch (error) {
    console.error("joinSession ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* LEAVE SESSION */
export const leaveSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({success: false, message: "userId is required"});
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({success: false, message: "Invalid sessionId"});
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({success: false, message: "Invalid userId"});
    }

    // Cast to ObjectId so $pull matches correctly against stored ObjectIds
    const userObjId    = new mongoose.Types.ObjectId(userId);
    const sessionObjId = new mongoose.Types.ObjectId(sessionId);

    const session = await Session.findById(sessionObjId);

    if (!session) {
      return res.status(404).json({success: false, message: "Session not found"});
    }

    if (session.createdBy.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Session creator cannot leave their own session"
      });
    }

    const isJoined = session.available_students.some(
      (member) => member.toString() === userId.toString()
    );

    if (!isJoined) {
      return res.status(400).json({success: false, message: "User has not joined this session"});
    }

    await Session.findByIdAndUpdate(
      sessionObjId,
      { $pull: { available_students: userObjId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Left session successfully",
      sessionId: session._id,
    });

  } catch (error) {
    console.error("leaveSession ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*DETERMINE EARLIEST SESSION FOR USER*/

export const findEarliestSession = async (req, res) => {
  try{
    const { uid } = req.params;

    //Query database to find all sessions user is a part of
    const query = {available_students: { "$in" : [uid]} };
    const sessions = await Session.find(query);

    if(!sessions){
      return res.status(400).json({
        success: false,
        message: "User is in no sessions"
      });
    }

    //Determine the earliest of the user's session 
    let earliest = null;
    let earliestDate = null;
    //Ensure the session is not from a passed date
    const now = new Date();
    
    //Format today's date to a normalized form for comparison
    const nowDB = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    let currentDate = null;

    for(let i=0; i<sessions.length; i++){
      //Convert DB "date" type to js date type, zeroing the timezone
      currentDate = new Date(sessions[i].date + 'T00:00:00.000Z');

      if(earliest === null){
        //Set the "default" value only if the date has not passed
        if(currentDate.valueOf() >= nowDB.valueOf()){
          earliest = sessions[i];
        }
      }

      earliestDate =  new Date(earliest.date + 'T00:00:00.000Z');

      //Set new earliest when a sooner, non-passed date is found
      if(currentDate.valueOf() < earliestDate.valueOf() && currentDate >= nowDB){
        earliest = sessions[i];
      }
      //Set new earliest if a session is on the same day, but earlier time
      else if(currentDate.valueOf() == earliestDate.valueOf()){
        if(sessions[i].time < earliest.time){
          earliest = sessions[i];
        }
      }
    }

    if (earliest != null){
      res.status(200).json({
        success: true,
        data: earliest
      });
    }

    else{
      res.status(500).json({
      success: false,
      message: "All session dates have passed"
    });  
    }


  }
  catch (error){
   console.error("getEarliestSession ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });  
  }
}