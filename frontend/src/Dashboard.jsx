import { useState } from "react";
import TopbarGlobe from "./TopbarGlobe";
import CursorSpotlight from "./CursorSpotlight";

const DEPARTMENTS = [
  "School of the Arts, Media, Performance & Design",
  "Faculty of Education",
  "Faculty of Environmental & Urban Change",
  "Glendon College",
  "Faculty of Graduate Studies",
  "Faculty of Health",
  "Faculty of Liberal Arts & Professional Studies",
  "Lassonde School of Engineering",
  "Faculty of Science",
  "Schulich School of Business",
];

const CAMPUSES = [
  "Catholic Education Center",
  "Glendon",
  "Keele",
  "Markham",
  "Off Campus",
  "Seneca at York",
  "Toronto Metropolitan University",
];

function Dashboard({
  currentUsername,
  currentUser,
  getMyGroups,
  searchGroups,
  searchResults,
  setSearchCourseCode,
  setSearchDepartment,
  setSearchMode,
  joinGroup,
  setTitle,
  setCourseCode,
  setDepartment,
  setMode,
  setLocation,
  createGroup,
  searchMessage,
  onViewGroup,
  onViewProfile,
  onLogout,
  myGroups = [],
  addToast,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [localCourse, setLocalCourse] = useState("");
  const [localDept, setLocalDept] = useState("");
  const [localMode, setLocalMode] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createCourse, setCreateCourse] = useState("");
  const [createDept, setCreateDept] = useState("");
  const [createMode, setCreateMode] = useState("");
  const [createLocation, setCreateLocation] = useState("");
  const [nextSession, setNextSession] = useState("");

  const handleCreate = async () => {
    const res = await createGroup({
      title: createTitle,
      courseCode: createCourse,
      department: createDept,
      mode: createMode,
      location: createLocation,
      members: [],
    });
    if (res?.success !== false) {
      setCreateTitle(""); setCreateCourse(""); setCreateDept("");
      setCreateMode(""); setCreateLocation("");
    }
  };

  const handleSearch = async () => {
    setSearchCourseCode(localCourse);
    setSearchDepartment(localDept);
    setSearchMode(localMode);
    setIsSearching(true);
    await searchGroups({ courseCode: localCourse, department: localDept, mode: localMode });
    setIsSearching(false);
  };

  const getNextSession = async () => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/sessions/${currentUser}/next`);
      const data = await res.json();
      if (data.success) setNextSession(data.data);
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <div style={s.page}>
      <CursorSpotlight />

      {/* Blobs */}
      <div style={{ ...s.blob, width: 500, height: 500, background: "#6366f1", top: "5%", left: "-5%", animationDelay: "0s" }} />
      <div style={{ ...s.blob, width: 400, height: 400, background: "#8b5cf6", bottom: "10%", right: "-5%", animationDelay: "3s" }} />
      <div style={{ ...s.blob, width: 350, height: 350, background: "#06b6d4", top: "50%", left: "40%", animationDelay: "5s" }} />

      {/* TOPBAR */}
      <header style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TopbarGlobe size={36} />
          <div>
            <div style={s.topbarTitle}>CampusConnect</div>
            <div style={s.topbarSub}>York University Study Group Platform</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onLogout && (
            <button onClick={onLogout} style={s.ghostBtn}>⏻ Logout</button>
          )}
          {onViewProfile && (
            <button onClick={() => onViewProfile(currentUser)} style={s.ghostBtn}>👤 Profile</button>
          )}
          <span style={s.pill}>🔑 {currentUsername}</span>
        </div>
      </header>

      {/* MAIN COLUMNS */}
      <div style={s.columns}>

        {/* LEFT — Create + Next Session */}
        <div style={s.colLeft}>
          {/* Create Group */}
          <div style={s.card}>
            <div style={s.cardTitle}>✨ Create Study Group</div>
            <div style={s.formStack}>
              <input style={s.input} placeholder="Group Name" value={createTitle} onChange={e => setCreateTitle(e.target.value)}
                onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
              <input style={s.input} placeholder="Course Code" value={createCourse} onChange={e => setCreateCourse(e.target.value)}
                onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
              <select style={s.select} value={createDept} onChange={e => setCreateDept(e.target.value)}>
                <option value="">Department</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                <select style={{ ...s.select, flex: 1 }} value={createMode} onChange={e => setCreateMode(e.target.value)}>
                  <option value="">Mode</option>
                  <option value="virtual">💻 Virtual</option>
                  <option value="inperson">📍 In Person</option>
                </select>
                <select style={{ ...s.select, flex: 1 }} value={createLocation} onChange={e => setCreateLocation(e.target.value)}>
                  <option value="">Campus</option>
                  {CAMPUSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button style={s.btnPrimary} onClick={handleCreate}>Create Group</button>
            </div>
          </div>

          {/* Next Session */}
          <div style={s.card}>
            <div style={s.cardTitle}>📅 Next Session</div>
            <button style={s.ghostBtn} onClick={getNextSession}>When's My Next Session?</button>
            {nextSession && nextSession !== "" && (
              <div style={s.sessionBox}>
                <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 14 }}>{nextSession.title}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>{nextSession.date} · {nextSession.time}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
                  {nextSession.mode === "inperson" ? `📍 ${nextSession.location}` : "💻 Virtual"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER — Search */}
        <div style={s.colCenter}>
          <div style={s.card}>
            <div style={s.cardTitle}>🔍 Explore Study Groups</div>
            <div style={s.searchRow}>
              <input style={{ ...s.input, flex: 1 }} placeholder="Search by course code…"
                value={localCourse} onChange={e => setLocalCourse(e.target.value)}
                onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
              <select style={{ ...s.select, flex: 1 }} value={localDept} onChange={e => setLocalDept(e.target.value)}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <select style={s.select} value={localMode} onChange={e => setLocalMode(e.target.value)}>
                <option value="">Any Mode</option>
                <option value="virtual">💻 Virtual</option>
                <option value="inperson">📍 In Person</option>
              </select>
              <button style={s.btnPrimary} onClick={handleSearch}>Search</button>
            </div>

            {/* Table Header */}
            <div style={s.tableHeader}>
              {["Group Name", "Course", "Department", "Mode", "Campus", "Actions"].map(h => (
                <span key={h} style={s.th}>{h}</span>
              ))}
            </div>

            {/* Skeleton */}
            {isSearching && [1,2,3].map(n => (
              <div key={n} style={s.skeletonRow}>
                {[1,2,3,4,5,6].map(i => <div key={i} style={s.skeletonCell} />)}
              </div>
            ))}

            {/* Empty */}
            {!isSearching && searchResults.length === 0 && (
              <div style={s.empty}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>◎</div>
                <div style={{ fontSize: 13, color: "#475569" }}>
                  {searchMessage || "Start by searching to discover study groups."}
                </div>
              </div>
            )}

            {/* Results */}
            {!isSearching && searchResults.map(group => (
              <div key={group._id} style={s.tableRow}
                onMouseEnter={e => e.currentTarget.style.background="rgba(99,102,241,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <span style={{ ...s.td, fontWeight: 600, color: "#f1f5f9" }}>{group.title}</span>
                <span style={s.td}><span style={s.courseTag}>{group.courseCode}</span></span>
                <span style={{ ...s.td, color: "#64748b", fontSize: 11 }}>{group.department}</span>
                <span style={s.td}>{group.mode === "virtual" ? "💻" : "📍"} {group.mode}</span>
                <span style={{ ...s.td, color: "#64748b" }}>{group.location}</span>
                <span style={{ ...s.td, display: "flex", gap: 6 }}>
                  <button style={s.btnSm} onClick={() => joinGroup(group._id)}>Join</button>
                  <button style={s.ghostBtnSm} onClick={() => onViewGroup(group)}>View</button>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — My Groups */}
        <div style={s.colRight}>
          <div style={s.card}>
            <div style={s.cardTitle}>👥 My Groups</div>
            <button style={{ ...s.btnPrimary, marginBottom: 12 }} onClick={getMyGroups}>See My Groups</button>
            {myGroups.length === 0 ? (
              <div style={{ fontSize: 12, color: "#475569", textAlign: "center", padding: "16px 0" }}>
                No groups joined yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {myGroups.map(g => (
                  <button key={g._id} onClick={() => onViewGroup(g)} style={s.groupItem}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(99,102,241,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
                    <div style={s.groupAvatar}>{g.title?.[0]?.toUpperCase() || "G"}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>{g.title}</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{g.courseCode}</div>
                    </div>
                    <div style={s.presenceDot} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes blob {
          0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity:1; }
          50% { transform: scale(1.6); opacity:0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        input::placeholder { color: #334155; }
        input:focus, select:focus { outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        select option { background: #0f172a; color: #f1f5f9; }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#070712",
    fontFamily: "'DM Sans', sans-serif",
    color: "#f1f5f9",
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.08,
    animation: "blob 8s ease-in-out infinite",
    zIndex: 0,
    pointerEvents: "none",
  },

  // TOPBAR
  topbar: {
    position: "sticky", top: 0, zIndex: 50,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 28px",
    background: "rgba(7,7,18,0.85)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
  },
  topbarTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18, fontWeight: 800, color: "#f1f5f9",
  },
  topbarSub: { fontSize: 11, color: "#475569" },
  pill: {
    fontSize: 12, fontWeight: 600,
    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
    border: "1px solid rgba(99,102,241,0.3)",
    color: "#a5b4fc", borderRadius: 20, padding: "6px 14px",
  },

  // LAYOUT
  columns: {
    display: "flex", gap: 16, padding: "20px 24px",
    alignItems: "flex-start", position: "relative", zIndex: 1,
    minHeight: "calc(100vh - 70px)",
  },
  colLeft: { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 },
  colCenter: { flex: 1, minWidth: 0 },
  colRight: { width: 220, flexShrink: 0 },

  // CARD
  card: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16, padding: "20px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 14, fontWeight: 700,
    color: "#f1f5f9", marginBottom: 14,
  },

  // FORM
  formStack: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "11px 14px",
    color: "#f1f5f9", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
    width: "100%",
  },
  select: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "11px 14px",
    color: "#f1f5f9", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer", width: "100%",
    appearance: "none",
  },

  // BUTTONS
  btnPrimary: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 10,
    padding: "11px 16px", color: "#fff",
    fontWeight: 600, fontSize: 13,
    cursor: "pointer", width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
    transition: "opacity 0.2s, transform 0.2s",
  },
  ghostBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "8px 14px",
    color: "#94a3b8", fontSize: 12, fontWeight: 500,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  },
  btnSm: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 7,
    padding: "5px 12px", color: "#fff",
    fontWeight: 600, fontSize: 11,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  ghostBtnSm: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 7, padding: "5px 12px",
    color: "#94a3b8", fontSize: 11,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },

  // SEARCH
  searchRow: {
    display: "flex", gap: 8, marginBottom: 16,
    alignItems: "center", flexWrap: "wrap",
  },

  // TABLE
  tableHeader: {
    display: "flex", alignItems: "center",
    padding: "8px 12px", borderRadius: 8,
    background: "rgba(99,102,241,0.06)",
    marginBottom: 4,
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
    transition: "background 0.15s ease", cursor: "default",
  },
  td: {
    flex: 1, fontSize: 12, color: "#94a3b8",
    textAlign: "center", paddingRight: 4,
  },
  courseTag: {
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.25)",
    color: "#a5b4fc", borderRadius: 5,
    padding: "2px 8px", fontSize: 11, fontWeight: 600,
  },

  // SKELETON
  skeletonRow: {
    display: "flex", alignItems: "center",
    padding: "10px 12px", gap: 8,
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  skeletonCell: {
    height: 12, borderRadius: 6, flex: 1,
    background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.03) 80%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.4s infinite linear",
  },

  // EMPTY
  empty: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "48px 16px", textAlign: "center",
    color: "#334155",
  },

  // SESSION
  sessionBox: {
    marginTop: 12,
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 10, padding: "12px 14px",
  },

  // GROUP ITEM
  groupItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", borderRadius: 10,
    border: "none", background: "rgba(255,255,255,0.03)",
    color: "white", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "left", transition: "background 0.15s ease",
    width: "100%", position: "relative",
    marginBottom: 4,
  },
  groupAvatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
    border: "1px solid rgba(99,102,241,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#a5b4fc", flexShrink: 0,
  },
  presenceDot: {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)",
    width: 7, height: 7, borderRadius: "50%",
    background: "#00e5a0",
    boxShadow: "0 0 6px rgba(0,229,160,0.7)",
    animation: "pulse 2.2s ease-in-out infinite",
  },
};

export default Dashboard;