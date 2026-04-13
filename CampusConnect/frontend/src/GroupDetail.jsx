import { useState, useEffect } from "react";
import TopbarGlobe from "./TopbarGlobe";
import GroupChat from "./GroupChat";   

function GroupDetail({ group, currentUser, currentUsername, onBack, onJoin, addToast }) {

  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
 
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);  //reschedule states
  const [rescheduleDate, setRescheduleDate] = useState(""); 
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
 
  const isLeader = group.leader === currentUser ||
                   group.leader?._id === currentUser ||
                   group.leader?.toString() === currentUser?.toString();
 
  const [members, setMembers] = useState(group.members);

  const isMember = members.some(
    m => m === currentUser || m?.toString() === currentUser?.toString()
  );
 
  useEffect(() => {
    fetchSessions();
  }, []);
 
  const fetchSessions = async () => {
    try {
      const res = await fetch(`http://localhost:2222/api/sessions/${group._id}`);
      const data = await res.json();
      if (data.success) setSessions(data.data);
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleCreateSession = async () => {
    try {
      const res = await fetch("http://localhost:2222/api/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, date, time, location, mode, meetingLink,
          groupId: group._id,
          createdBy: currentUser
        })
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        addToast(data.message || "Failed to create session", "error");
        return;
      }
 
      setSessions(prev => [...prev, data.data]);
      addToast("Session created successfully! 📅", "success");
      setShowForm(false);
      setTitle(""); setDate(""); setTime(""); setLocation(""); setMode(""); setMeetingLink("");
 
    } catch {
      addToast("Error creating session", "error");
    }
  };

  const joinSession = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:2222/api/sessions/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to join");
      addToast(data.message || "Joined session successfully!", "success");
      fetchSessions();
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const leaveSession = async (sessionId) => {
    try {
      const sId = sessionId?.toString() || sessionId;
      const uId = currentUser?.toString() || currentUser;
      const response = await fetch(`http://localhost:2222/api/sessions/${sId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to leave session");
      addToast(data.message || "Left session successfully!", "success");
      fetchSessions();
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const leaveGroup = async () => {
    try {
      const gId = group._id?.toString() || group._id;
      const uId = currentUser?.toString() || currentUser;
      const response = await fetch(`http://localhost:2222/api/groups/${gId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to leave group");
      addToast(data.message || "Left group successfully!", "success");
      setMembers(prev => prev.filter(m => m?.toString() !== uId));
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  //Cancel Session Handler
  const cancelSession = async (sessionId) => {
  try {
    //Adds confirmation
    if (!window.confirm("Are you sure you want to cancel this session?")) return;
    
    const sId = sessionId?.toString() || sessionId;
    console.log("[cancelSession] sessionId:", sId);

    const response = await fetch(`http://localhost:2222/api/sessions/${sId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    console.log("[cancelSession] response:", data);

    if (!response.ok) throw new Error(data.message || "Failed to cancel session");

    addToast(data.message || "Session canceled successfully!", "success");
    fetchSessions(); // refresh session list
  } catch (error) {
    addToast(error.message, "error");
  }
};

  //Reschedule Session Handler
  const handleRescheduleSession = async () => {
  if (!rescheduleDate || !rescheduleTime) {
    addToast("Please enter date and time", "error");
    return;
  }
  try {
    const response = await fetch(`http://localhost:2222/api/sessions/${rescheduleSessionId}/reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newDate: rescheduleDate, newTime: rescheduleTime })
    });
    console.log("New Date: " + rescheduleDate);
    console.log("New Time: " + rescheduleTime);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to reschedule session");
    addToast(data.message || "Session rescheduled!", "success");
    fetchSessions();
    setShowRescheduleModal(false);
  } catch (error) {
    addToast(error.message, "error");
  }
};

  

  // Helper: has the current user joined a given session?
  const hasJoinedSession = (session) =>
    session.available_students.some(
      (s) => s === currentUser || s?.toString() === currentUser?.toString()
    );

  const isSessionCreator = (session) =>
    session.createdBy === currentUser ||
    session.createdBy?.toString() === currentUser?.toString();
 
  return (
    <div className="dashboard-page">
      <div className="login-bg-overlay" />
 
      <div className="dash-body">
 
        {/* TOPBAR */}
        <header className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <TopbarGlobe size={44} />
            <div>
              <h1 className="logo-text" style={{ fontSize: 24, margin: 0 }}>
                StudySphere
              </h1>
              <p className="subtitle" style={{ margin: "2px 0 0", fontSize: 12 }}>
                {group.title}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="dash-btn-ghost" onClick={onBack}>
              ← Back
            </button>
            <span className="dash-passport-pill">🔑 {currentUsername}</span>
          </div>
        </header>
 
        {/* CENTERED CONTENT */}
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 24px 60px" }}>
          <div style={{ width: "100%", maxWidth: "700px", display: "flex", flexDirection: "column", gap: "16px" }}>
 
            {/* TOP CARDS — equal 2x2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
 
              <div className="glass-card dash-panel">
                <h3 className="dash-panel-title">Course</h3>
                <p style={{ color: "white", fontWeight: 600, fontSize: 15, margin: "0 0 6px" }}>
                  {group.courseCode}
                </p>
                <p className="dash-muted" style={{ margin: 0 }}>{group.department}</p>
              </div>
 
              <div className="glass-card dash-panel">
                <h3 className="dash-panel-title">Mode</h3>
                <p style={{ color: "white", fontWeight: 600, fontSize: 15, margin: "0 0 6px" }}>
                  {group.mode === "virtual" ? "💻 Virtual" : "📍 In Person"}
                </p>
                <p className="dash-muted" style={{ margin: 0 }}>{group.location}</p>
              </div>
 
              <div className="glass-card dash-panel">
                <h3 className="dash-panel-title">Members</h3>
                <p style={{ color: "white", fontWeight: 600, fontSize: 15, margin: "0 0 10px" }}>
                  {members.length} Members
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {members.slice(0, 4).map((m, i) => (
                    <div key={i} className="gd-avatar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                  ))}
                  {members.length > 4 && (
                    <div className="gd-avatar gd-avatar-more">+{members.length - 4}</div>
                  )}
                </div>
              </div>
 
              <div className="glass-card dash-panel">
                <h3 className="dash-panel-title">Status</h3>

                {/* Not a member → show Join */}
                {!isMember && (
                  <button
                    className="primary-login-btn"
                    style={{ width: "auto", padding: "0 20px", height: 38 }}
                    onClick={() => {
                      onJoin(group._id);
                      setMembers(prev => [...prev, currentUser]);
                    }}
                  >
                    Join Group
                  </button>
                )}

                {/* Regular member → show member badge + Leave button */}
                {isMember && !isLeader && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p className="feedback-msg success" style={{ margin: 0 }}>✅ You are a member</p>
                    <button
                      style={{
                        width: "100%", padding: "0 16px", height: 34, fontSize: 12, fontWeight: 700,
                        borderRadius: 8, border: "1.5px solid #ff4060", cursor: "pointer",
                        fontFamily: "Poppins, sans-serif", color: "#ffffff",
                        background: "rgba(200,16,46,0.75)",
                        boxShadow: "0 2px 12px rgba(200,16,46,0.4)",
                      }}
                      onClick={leaveGroup}
                    >
                      🚪 Leave Group
                    </button>
                  </div>
                )}

                {/* Leader → show leader badge, no leave option */}
                {isLeader && (
                  <p className="feedback-msg success" style={{ margin: 0 }}>👑 You are the leader</p>
                )}
              </div>
 
            </div>
 
            {/* SESSIONS */}
            <div className="glass-card dash-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 className="dash-panel-title" style={{ margin: 0 }}>📅 Scheduled Sessions</h3>
                {isLeader && (
                  <button
                    className={showForm ? "dash-btn-ghost" : "primary-login-btn"}
                    style={{ width: "auto", padding: "0 16px", height: 34, fontSize: 12 }}
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? "✕ Cancel" : "+ Create Session"}
                  </button>
                )}
              </div>
 
              <div className="dash-table-header">
                <span className="dash-th" style={{ flex: 2 }}>Title</span>
                <span className="dash-th">Date</span>
                <span className="dash-th">Time</span>
                <span className="dash-th">Location</span>
                <span className="dash-th">Link</span>
                <span className="dash-th">Action</span>
                <span className="dash-th">Going</span>
              </div>
 
              {sessions.length === 0 && (
                <div className="dash-empty-wrapper">
                  <div className="dash-empty">
                    <span className="dash-empty-icon">📅</span>
                    <p className="dash-empty-text">No sessions yet</p>
                    <span className="dash-empty-sub">Create your first study session!</span>
                  </div>
                </div>
              )}
 
              {sessions.map((s) => {
                const joined = hasJoinedSession(s);
                const creator = isSessionCreator(s);
                return (
                  <div key={s._id} className="dash-table-row">
                    <span className="dash-td" style={{ flex: 2, fontWeight: 600, color: "white" }}>{s.title}</span>
                    <span className="dash-td">{new Date(s.date).toLocaleDateString()}</span>
                    <span className="dash-td">{s.time}</span>
                    <span className="dash-td dash-muted">
                      {s.mode === "virtual" ? "💻" : "📍"} {s.location}
                    </span>
                    <span className="dash-td">
                      {s.meetingLink ? (
                        <a
                          href={s.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: "rgba(200,16,46,0.15)", border: "1px solid rgba(200,16,46,0.35)",
                            color: "#ff7080", borderRadius: 20, padding: "3px 11px",
                            fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
                          }}
                        >
                          🔗 Join
                        </a>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>—</span>
                      )}
                    </span>
                      {/*Study Session visual components*/}
                    {isMember ? (
                      <span className="dash-td">
                        {creator ? (
                          <>
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Creator</span>
                            {/* Session creator — show Cancel + Reschedule */}
                            <span style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                              <button
                                className="dash-btn-ghost"
                                style={{ fontSize: 11, padding: "3px 10px", height: "auto", borderColor: "#ff4060", color: "#ff4060", background: "rgba(255,64,96,0.18)", fontWeight: 600 }}
                                onClick={() => cancelSession(s._id)}
                              >
                                Cancel
                              </button>
                              
                              <button
                                className="primary-login-btn"
                                style={{ fontSize: 11, padding: "3px 10px", height: "auto" }}
                                onClick={() => {  //opens the modal and pre-fills the current date/time
                                  setRescheduleSessionId(s._id); 
                                  setRescheduleDate(s.date.split("T")[0]); // format YYYY-MM-DD
                                  setRescheduleTime(s.time);
                                  setShowRescheduleModal(true);
                                }}
                              >
                                Reschedule
                              </button>
                              
                            </span>
                          </>
                        
                        ) : joined ? (
                          <button
                            style={{
                              fontSize: 11, padding: "4px 12px", height: "auto",
                              border: "1.5px solid #ff4060", color: "#ffffff",
                              background: "rgba(200,16,46,0.75)", fontWeight: 700,
                              borderRadius: 6, cursor: "pointer", fontFamily: "Poppins, sans-serif",
                              boxShadow: "0 2px 8px rgba(200,16,46,0.35)",
                            }}
                            onClick={() => leaveSession(s._id)}
                          >
                            Leave
                          </button>
                        ) : (
                          <button
                            className="primary-login-btn"
                            style={{ fontSize: 11, padding: "3px 10px", height: "auto" }}
                            onClick={() => joinSession(s._id)}
                          >
                            Join
                          </button>
                        )}
                                   
                      </span>
                    ) : (
                      <span className="dash-td" style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>—</span>
                    )}

                    <span className="dash-td">{s.available_students.length}</span>
                  </div>
                );
              })}

              
              {showRescheduleModal && ( //Reschedule modal
                      <div className="modal-overlay">
                        <div className="glass-card dash-panel" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
                          <h3 className="dash-panel-title">Reschedule Session</h3>
                          <div className="dash-form-stack">
                            <input
                              className="glass-input"
                              type="date"
                              value={rescheduleDate}
                              onChange={(e) => setRescheduleDate(e.target.value)}
                            />
                            <input
                              className="glass-input"
                              type="time"
                              value={rescheduleTime}
                              onChange={(e) => setRescheduleTime(e.target.value)}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                              <button
                                className="dash-btn-ghost"
                                onClick={() => {
                                  setShowRescheduleModal(false);
                                  setRescheduleSessionId(null); // resets the session ID when modal closes
                                }}
                                style={{ width: "48%" }}
                              >
                                Cancel
                              </button>
                              <button
                                className="primary-login-btn"
                                style={{ width: "48%" }}
                                onClick={() => handleRescheduleSession()}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
            </div>

    
 
            {/* CREATE SESSION FORM */}
            {showForm && (
              <div className="glass-card dash-panel">
                <h3 className="dash-panel-title">Create Session</h3>
                <div className="dash-form-stack">
                  <input className="glass-input" placeholder="Session Title (e.g. Midterm Review)" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <div className="dash-row2">
                    <input className="glass-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <input className="glass-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                  <input className="glass-input" placeholder="Location or Zoom link" value={location} onChange={(e) => setLocation(e.target.value)} />
                  <select className="glass-input dash-select" value={mode} onChange={(e) => { setMode(e.target.value); if (e.target.value !== "virtual") setMeetingLink(""); }}>
                    <option value="">Select Mode</option>
                    <option value="virtual">💻 Virtual</option>
                    <option value="inperson">📍 In Person</option>
                  </select>
                  {mode === "virtual" && (
                    <input className="glass-input" placeholder="Meeting link (Zoom, Teams, Google Meet…)" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
                  )}
                  <button className="primary-signup-btn" onClick={handleCreateSession}>Create Session</button>
                </div>
              </div>
            )}

            {/* GROUP CHAT */}
            {isMember || isLeader ? (
              <GroupChat
                groupId={group._id}
                token={localStorage.getItem('token')}
                username={currentUsername}
              />
            ) : (
              <div className="glass-card dash-panel" style={{ textAlign: 'center', padding: '30px' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                  🔒 Join this group to access the group chat
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
 
export default GroupDetail;
