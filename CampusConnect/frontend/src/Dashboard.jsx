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

  // Controlled create form state
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
      setCreateTitle("");
      setCreateCourse("");
      setCreateDept("");
      setCreateMode("");
      setCreateLocation("");
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
    try{
      const res = await fetch(`http://localhost:2222/api/sessions/${currentUser}/next`);
      const data = await res.json();
      if(data.success){
        setNextSession(data.data);
      }
    }
    catch (error){
      addToast(error.message, "error");
    }
  }

  return (
    <div className="dashboard-page">
      <div className="login-bg-overlay" />
      <CursorSpotlight />

      <div className="dash-body">
        <header className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <TopbarGlobe size={44} />
            <div>
              <h1 className="logo-text" style={{ fontSize: 24, margin: 0 }}>StudySphere</h1>
              <p className="subtitle" style={{ margin: "2px 0 0", fontSize: 12 }}>York University Study Group Platform</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {onLogout && (
              <button className="dash-btn-ghost" onClick={onLogout} style={{ borderColor: "rgba(200,16,46,0.35)", color: "#ff8fa3" }}>
                ⏻ Logout
              </button>
            )}
            {onViewProfile && (
              <button className="dash-btn-ghost" onClick={() => onViewProfile(currentUser)}>
                👤 Profile
              </button>
            )}
            <span className="dash-passport-pill">🔑 {currentUsername}</span>
          </div>
        </header>

        <div className="dash-columns">

          {/* CREATE AND NEXT STUDY SESSIOn */}
          <div className="dash-col-left">
            <div className="glass-card dash-panel">
              <h2 className="dash-panel-title">Create New Sphere</h2>
              <div className="dash-form-stack">
                <input className="glass-input" placeholder="Group Name" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} />
                <input className="glass-input" placeholder="Course Code" value={createCourse} onChange={(e) => setCreateCourse(e.target.value)} />
                <select className="glass-input dash-select" value={createDept} onChange={(e) => setCreateDept(e.target.value)}>
                  <option value="">Department</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <div className="dash-row2">
                  <select className="glass-input dash-select" value={createMode} onChange={(e) => setCreateMode(e.target.value)}>
                    <option value="">Mode</option>
                    <option value="virtual">💻 Virtual</option>
                    <option value="inperson">📍 In Person</option>
                  </select>
                  <select className="glass-input dash-select" value={createLocation} onChange={(e) => setCreateLocation(e.target.value)}>
                    <option value="">Campus</option>
                    {CAMPUSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button className="primary-signup-btn" onClick={handleCreate}>Create Group</button>
              </div>
            </div>

            {/*NEXT STUDY SESSION*/}
            <div className="glass-card dash-panel">
            <h2 className="dash-panel-title">Next Session:</h2>
            <button className="dash-btn-ghost" onClick={getNextSession}>When's My Next Session?</button>
            {nextSession === "" || undefined ? (<p></p>):
            (<div>
              <p>{nextSession.title} - {nextSession.date}</p>
              {nextSession.mode == "inperson" ? (<p>Location: {nextSession.location}</p>) : (<p>{nextSession.mode}</p>)}
              <p>Time: {nextSession.time}</p>
            </div>)}
            </div>
          </div>

          

          {/* SEARCH */}
          <div className="dash-col-center">
            <div className="glass-card dash-panel">
              <h2 className="dash-panel-title">Explore Spheres</h2>
              <div className="dash-search-row">
                <input className="glass-input" style={{ flex: 1 }} placeholder="Search by course code…" value={localCourse} onChange={(e) => setLocalCourse(e.target.value)} />
                <select className="glass-input dash-select" value={localDept} onChange={(e) => setLocalDept(e.target.value)}>
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <select className="glass-input dash-select" value={localMode} onChange={(e) => setLocalMode(e.target.value)}>
                  <option value="">Any Mode</option>
                  <option value="virtual">💻 Virtual</option>
                  <option value="inperson">📍 In Person</option>
                </select>
                <button className="primary-login-btn" onClick={handleSearch}>🔍 Search</button>
              </div>

              <div className="dash-table-wrap">
                <div className="dash-table-header">
                  <span className="dash-th col-name">Group Name</span>
                  <span className="dash-th col-course">Course</span>
                  <span className="dash-th col-dept">Department</span>
                  <span className="dash-th col-mode">Mode</span>
                  <span className="dash-th col-campus">Campus</span>
                  <span className="dash-th col-actions">Actions</span>
                </div>

                {isSearching && (
                  <>{[1, 2, 3].map((n) => (
                    <div key={n} className="skeleton-row">
                      <div className="skeleton-cell medium" />
                      <div className="skeleton-cell short" />
                      <div className="skeleton-cell long" />
                      <div className="skeleton-cell short" />
                      <div className="skeleton-cell short" />
                      <div className="skeleton-cell btn" />
                    </div>
                  ))}</>
                )}

                {!isSearching && searchResults.length === 0 && (
                  <div className="dash-empty-wrapper">
                    <div className="dash-empty">
                      <span className="dash-empty-icon">◎</span>
                      <p className="dash-empty-text">{searchMessage || "Start by searching to discover study groups."}</p>
                    </div>
                  </div>
                )}

                {!isSearching && searchResults.map((group) => (
                  <div key={group._id} className="dash-table-row">
                    <span className="dash-td col-name dash-strong">{group.title}</span>
                    <span className="dash-td col-course">{group.courseCode}</span>
                    <span className="dash-td col-dept dash-muted">{group.department}</span>
                    <span className="dash-td col-mode">{group.mode === "virtual" ? "💻" : "📍"} {group.mode}</span>
                    <span className="dash-td col-campus dash-muted">{group.location}</span>
                    <span className="dash-td col-actions">
                      <div className="dash-action-btns">
                        <button className="primary-login-btn dash-btn-sm" onClick={() => joinGroup(group._id)}>Join</button>
                        <button className="dash-btn-ghost" onClick={() => onViewGroup(group)}>View</button>
                      </div>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MY GROUPS */}
          <div className="dash-col-right">
            <div className="glass-card dash-panel">
              <h2 className="dash-panel-title">My Groups</h2>
              <button className="primary-signup-btn" onClick={getMyGroups}>See My Groups</button>
              {myGroups.length === 0 ? (
                <p className="dash-muted">No groups joined yet.</p>
              ) : (
                <div className="dash-group-list">
                  {myGroups.map((g) => (
                    <button key={g._id} className="dash-group-item" onClick={() => onViewGroup(g)}>
                      <div className="dash-group-avatar">{g.title?.[0]?.toUpperCase() || "G"}</div>
                      <div className="dash-group-info">
                        <span className="dash-group-name">{g.title}</span>
                        <span className="dash-group-code">{g.courseCode}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;