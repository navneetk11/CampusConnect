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
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const isLeader = group.leader === currentUser ||
    group.leader?._id === currentUser ||
    group.leader?.toString() === currentUser?.toString();

  const [members, setMembers] = useState(group.members);
  const isMember = members.some(m => m === currentUser || m?.toString() === currentUser?.toString());

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/sessions/${group._id}`);
      const data = await res.json();
      if (data.success) setSessions(data.data);
    } catch (error) { console.error(error); }
  };

  const handleCreateSession = async () => {
    try {
      const res = await fetch("https://campusconnect-8loz.onrender.com/api/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, time, location, mode, meetingLink, groupId: group._id, createdBy: currentUser })
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.message || "Failed to create session", "error"); return; }
      setSessions(prev => [...prev, data.data]);
      addToast("Session created successfully! 📅", "success");
      setShowForm(false);
      setTitle(""); setDate(""); setTime(""); setLocation(""); setMode(""); setMeetingLink("");
    } catch { addToast("Error creating session", "error"); }
  };

  const joinSession = async (sessionId) => {
    try {
      const response = await fetch(`https://campusconnect-8loz.onrender.com/api/sessions/${sessionId}/join`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to join");
      addToast(data.message || "Joined session!", "success");
      fetchSessions();
    } catch (error) { addToast(error.message, "error"); }
  };

  const leaveSession = async (sessionId) => {
    try {
      const response = await fetch(`https://campusconnect-8loz.onrender.com/api/sessions/${sessionId}/leave`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to leave");
      addToast(data.message || "Left session!", "success");
      fetchSessions();
    } catch (error) { addToast(error.message, "error"); }
  };

  const leaveGroup = async () => {
    try {
      const response = await fetch(`https://campusconnect-8loz.onrender.com/api/groups/${group._id}/leave`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to leave group");
      addToast(data.message || "Left group!", "success");
      setMembers(prev => prev.filter(m => m?.toString() !== currentUser?.toString()));
    } catch (error) { addToast(error.message, "error"); }
  };

  const cancelSession = async (sessionId) => {
    try {
      if (!window.confirm("Cancel this session?")) return;
      const response = await fetch(`https://campusconnect-8loz.onrender.com/api/sessions/${sessionId}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to cancel");
      addToast(data.message || "Session cancelled!", "success");
      fetchSessions();
    } catch (error) { addToast(error.message, "error"); }
  };

  const handleRescheduleSession = async () => {
    if (!rescheduleDate || !rescheduleTime) { addToast("Please enter date and time", "error"); return; }
    try {
      const response = await fetch(`https://campusconnect-8loz.onrender.com/api/sessions/${rescheduleSessionId}/reschedule`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newDate: rescheduleDate, newTime: rescheduleTime })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reschedule");
      addToast(data.message || "Session rescheduled!", "success");
      fetchSessions();
      setShowRescheduleModal(false);
    } catch (error) { addToast(error.message, "error"); }
  };

  const hasJoinedSession = (session) =>
    session.available_students.some(s => s === currentUser || s?.toString() === currentUser?.toString());

  const isSessionCreator = (session) =>
    session.createdBy === currentUser || session.createdBy?.toString() === currentUser?.toString();

  return (
    <div style={s.page}>
      {/* Blobs */}
      <div style={{ ...s.blob, width: 500, height: 500, background: "#6366f1", top: "5%", left: "-5%", animationDelay: "0s" }} />
      <div style={{ ...s.blob, width: 400, height: 400, background: "#8b5cf6", bottom: "10%", right: "-5%", animationDelay: "3s" }} />

      {/* TOPBAR */}
      <header style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TopbarGlobe size={36} />
          <div>
            <div style={s.topbarTitle}>CampusConnect</div>
            <div style={s.topbarSub}>{group.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={s.ghostBtn}>← Back</button>
          <span style={s.pill}>🔑 {currentUsername}</span>
        </div>
      </header>

      {/* CONTENT */}
      <div style={s.content}>
        <div style={s.inner}>

          {/* TOP GRID */}
          <div style={s.grid}>

            <div style={s.card}>
              <div style={s.cardLabel}>COURSE</div>
              <div style={s.cardValue}>{group.courseCode}</div>
              <div style={s.cardSub}>{group.department}</div>
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>MODE</div>
              <div style={s.cardValue}>{group.mode === "virtual" ? "💻 Virtual" : "📍 In Person"}</div>
              <div style={s.cardSub}>{group.location}</div>
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>MEMBERS</div>
              <div style={s.cardValue}>{members.length} Members</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {members.slice(0, 4).map((m, i) => (
                  <div key={i} style={s.memberAvatar}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                ))}
                {members.length > 4 && (
                  <div style={{ ...s.memberAvatar, background: "rgba(255,255,255,0.06)", color: "#64748b" }}>
                    +{members.length - 4}
                  </div>
                )}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>STATUS</div>
              {!isMember && (
                <button style={s.btnPrimary} onClick={() => { onJoin(group._id); setMembers(prev => [...prev, currentUser]); }}>
                  Join Group
                </button>
              )}
              {isMember && !isLeader && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ color: "#4ade80", fontSize: 13, fontWeight: 600 }}>✅ You are a member</div>
                  <button style={s.dangerBtn} onClick={leaveGroup}>🚪 Leave Group</button>
                </div>
              )}
              {isLeader && (
                <div style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>👑 You are the leader</div>
              )}
            </div>
          </div>

          {/* SESSIONS */}
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={s.cardLabel}>📅 SCHEDULED SESSIONS</div>
              {isLeader && (
                <button style={showForm ? s.ghostBtn : s.btnPrimarySm}
                  onClick={() => setShowForm(!showForm)}>
                  {showForm ? "✕ Cancel" : "+ Create Session"}
                </button>
              )}
            </div>

            {/* Table header */}
            <div style={s.tableHeader}>
              {["Title", "Date", "Time", "Location", "Link", "Action", "Going"].map(h => (
                <span key={h} style={s.th}>{h}</span>
              ))}
            </div>

            {sessions.length === 0 && (
              <div style={s.empty}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                <div style={{ fontSize: 13, color: "#475569" }}>No sessions yet — create your first!</div>
              </div>
            )}

            {sessions.map(sess => {
              const joined = hasJoinedSession(sess);
              const creator = isSessionCreator(sess);
              return (
                <div key={sess._id} style={s.tableRow}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ ...s.td, fontWeight: 600, color: "#f1f5f9" }}>{sess.title}</span>
                  <span style={s.td}>{new Date(sess.date).toLocaleDateString()}</span>
                  <span style={s.td}>{sess.time}</span>
                  <span style={{ ...s.td, color: "#64748b" }}>{sess.mode === "virtual" ? "💻" : "📍"} {sess.location}</span>
                  <span style={s.td}>
                    {sess.meetingLink ? (
                      <a href={sess.meetingLink} target="_blank" rel="noopener noreferrer" style={s.linkBadge}>🔗 Join</a>
                    ) : <span style={{ color: "#334155" }}>—</span>}
                  </span>
                  <span style={{ ...s.td, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {isMember ? (
                      creator ? (
                        <>
                          <button style={s.dangerBtnSm} onClick={() => cancelSession(sess._id)}>Cancel</button>
                          <button style={s.btnPrimarySm} onClick={() => {
                            setRescheduleSessionId(sess._id);
                            setRescheduleDate(sess.date.split("T")[0]);
                            setRescheduleTime(sess.time);
                            setShowRescheduleModal(true);
                          }}>Reschedule</button>
                        </>
                      ) : joined ? (
                        <button style={s.dangerBtnSm} onClick={() => leaveSession(sess._id)}>Leave</button>
                      ) : (
                        <button style={s.btnPrimarySm} onClick={() => joinSession(sess._id)}>Join</button>
                      )
                    ) : <span style={{ color: "#334155" }}>—</span>}
                  </span>
                  <span style={{ ...s.td, color: "#a5b4fc", fontWeight: 600 }}>{sess.available_students.length}</span>
                </div>
              );
            })}
          </div>

          {/* CREATE SESSION FORM */}
          {showForm && (
            <div style={s.card}>
              <div style={s.cardLabel}>CREATE SESSION</div>
              <div style={s.formStack}>
                <input style={s.input} placeholder="Session Title" value={title} onChange={e => setTitle(e.target.value)}
                  onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={{ ...s.input, flex: 1 }} type="date" value={date} onChange={e => setDate(e.target.value)} />
                  <input style={{ ...s.input, flex: 1 }} type="time" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <input style={s.input} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)}
                  onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                <select style={s.select} value={mode} onChange={e => { setMode(e.target.value); if (e.target.value !== "virtual") setMeetingLink(""); }}>
                  <option value="">Select Mode</option>
                  <option value="virtual">💻 Virtual</option>
                  <option value="inperson">📍 In Person</option>
                </select>
                {mode === "virtual" && (
                  <input style={s.input} placeholder="Meeting link (Zoom, Teams…)" value={meetingLink} onChange={e => setMeetingLink(e.target.value)}
                    onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                )}
                <button style={s.btnPrimary} onClick={handleCreateSession}>Create Session</button>
              </div>
            </div>
          )}

          {/* GROUP CHAT */}
          {isMember || isLeader ? (
            <GroupChat groupId={group._id} token={localStorage.getItem("token")} username={currentUsername} />
          ) : (
            <div style={{ ...s.card, textAlign: "center", color: "#475569", padding: "30px" }}>
              🔒 Join this group to access the group chat
            </div>
          )}
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={{ ...s.cardLabel, marginBottom: 16 }}>RESCHEDULE SESSION</div>
            <div style={s.formStack}>
              <input style={s.input} type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} />
              <input style={s.input} type="time" value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button style={{ ...s.ghostBtn, flex: 1 }} onClick={() => { setShowRescheduleModal(false); setRescheduleSessionId(null); }}>Cancel</button>
                <button style={{ ...s.btnPrimary, flex: 1 }} onClick={handleRescheduleSession}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes blob {
          0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
        }
        input::placeholder { color: #334155; }
        input:focus, select:focus { outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        select option { background: #0f172a; color: #f1f5f9; }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", background: "#070712",
    fontFamily: "'DM Sans', sans-serif", color: "#f1f5f9",
    position: "relative", overflow: "hidden",
  },
  blob: {
    position: "absolute", borderRadius: "50%",
    filter: "blur(80px)", opacity: 0.08,
    animation: "blob 8s ease-in-out infinite",
    zIndex: 0, pointerEvents: "none",
  },
  topbar: {
    position: "sticky", top: 0, zIndex: 50,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 28px",
    background: "rgba(7,7,18,0.85)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
  },
  topbarTitle: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#f1f5f9" },
  topbarSub: { fontSize: 11, color: "#475569" },
  pill: {
    fontSize: 12, fontWeight: 600,
    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
    border: "1px solid rgba(99,102,241,0.3)",
    color: "#a5b4fc", borderRadius: 20, padding: "6px 14px",
  },
  content: { display: "flex", justifyContent: "center", padding: "24px 24px 60px", position: "relative", zIndex: 1 },
  inner: { width: "100%", maxWidth: 760, display: "flex", flexDirection: "column", gap: 16 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  card: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16, padding: 20,
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  cardLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#475569", marginBottom: 8, textTransform: "uppercase" },
  cardValue: { fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#64748b" },
  memberAvatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
    border: "1px solid rgba(99,102,241,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, color: "#a5b4fc",
  },
  formStack: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "11px 14px",
    color: "#f1f5f9", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s", width: "100%",
  },
  select: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "11px 14px",
    color: "#f1f5f9", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer", width: "100%", appearance: "none",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 10,
    padding: "11px 16px", color: "#fff",
    fontWeight: 600, fontSize: 13, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
    width: "100%",
  },
  btnPrimarySm: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 7,
    padding: "5px 12px", color: "#fff",
    fontWeight: 600, fontSize: 11, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  ghostBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "8px 14px",
    color: "#94a3b8", fontSize: 12, fontWeight: 500,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  dangerBtn: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 8, padding: "8px 14px",
    color: "#fca5a5", fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    width: "100%",
  },
  dangerBtnSm: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 7, padding: "5px 12px",
    color: "#fca5a5", fontSize: 11, fontWeight: 600,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  tableHeader: {
    display: "flex", alignItems: "center",
    padding: "8px 12px", borderRadius: 8,
    background: "rgba(99,102,241,0.06)", marginBottom: 4,
  },
  th: {
    flex: 1, fontSize: 10, fontWeight: 700,
    color: "#475569", textTransform: "uppercase",
    letterSpacing: 0.8, textAlign: "center",
  },
  tableRow: {
    display: "flex", alignItems: "center",
    padding: "10px 12px", borderRadius: 8,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "background 0.15s ease",
  },
  td: { flex: 1, fontSize: 12, color: "#94a3b8", textAlign: "center", paddingRight: 4 },
  linkBadge: {
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
    color: "#a5b4fc", borderRadius: 20, padding: "3px 10px",
    fontSize: 11, fontWeight: 700, textDecoration: "none",
  },
  empty: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "40px 16px", textAlign: "center",
  },
  modalOverlay: {
    position: "fixed", inset: 0, zIndex: 100,
    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 16, padding: 28,
    width: "100%", maxWidth: 380,
    boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
  },
};

export default GroupDetail;