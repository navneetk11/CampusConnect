import { useState, useEffect } from "react";
import TopbarGlobe from "./TopbarGlobe";
import CursorSpotlight from "./CursorSpotlight";
import LanyardBadge from "./LanyardBadge";

function Profile({ currentUser, onBack, addToast }) {
  const [username, setUsername] = useState("");
  const [courses, setCourses] = useState([]);
  const [year, setYear] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [groupCount, setGroupCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newPass, changePass] = useState("");
  const [newUsername, changeUsername] = useState("");

  useEffect(() => {
    if (!currentUser) { onBack(); return; }
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/users/${currentUser}`);
      const data = await res.json();
      if (data.success) {
        setUsername(data.data.username);
        setYear(data.data.year || "Not Assigned");
        setNewYear(data.data.year || "");
        if (data.data.courses?.length > 0) {
          const courseData = await Promise.all(data.data.courses.map(c => getCourseInfo(c)));
          setCourses(courseData.filter(Boolean));
        } else { setCourses([]); }
        setGroupCount(data.data.groups?.length || 0);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const getCourseInfo = async (courseID) => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/courses/courseInfo/${courseID}`);
      if (res.ok) { const data = await res.json(); return data.courseCode; }
    } catch (error) { console.error(error); }
  };

  const changeYear = async () => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/users/EditYear/${currentUser}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: newYear }),
      });
      const data = await res.json();
      if (data.success) setYear(data.year || newYear);
      addToast("Year of study updated!", "success");
    } catch (error) { console.error(error); }
  };

  const removeCourse = async (courseCode) => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/users/deleteCourse/${currentUser}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode }),
      });
      const data = await res.json();
      addToast("Course Removed", "success");
      if (data.success) getUser();
    } catch (error) { addToast("Could not remove Course", "error"); }
  };

  const addCourseToUser = async () => {
    if (!newCourse.trim()) return;
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/users/addCourse/${currentUser}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode: newCourse }),
      });
      const data = await res.json();
      if (data.success) { setNewCourse(""); getUser(); addToast("Course added!", "success"); }
    } catch (error) { addToast("Could not add Course", "error"); }
  };

  const changeUserName = async () => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/users/update/${currentUser}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");
      addToast("Username Updated!", "success");
      getUser();
    } catch (error) { addToast("Error updating username", "error"); }
  };

  const changePassword = async () => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/users/update/${currentUser}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPass }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");
      addToast("Password updated!", "success");
      getUser();
    } catch (error) { addToast("Error updating password", "error"); }
  };

  return (
    <div style={s.page}>
      <CursorSpotlight />

      {/* Blobs */}
      <div style={{ ...s.blob, width: 500, height: 500, background: "#6366f1", top: "5%", left: "-5%", animationDelay: "0s" }} />
      <div style={{ ...s.blob, width: 400, height: 400, background: "#8b5cf6", bottom: "10%", right: "-5%", animationDelay: "3s" }} />
      <div style={{ ...s.blob, width: 300, height: 300, background: "#06b6d4", top: "40%", left: "40%", animationDelay: "5s" }} />

      {/* TOPBAR */}
      <header style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TopbarGlobe size={36} />
          <div>
            <div style={s.topbarTitle}>CampusConnect</div>
            <div style={s.topbarSub}>York University Study Group Platform</div>
          </div>
        </div>
        <button onClick={onBack} style={s.ghostBtn}>← Back</button>
      </header>

      {/* CONTENT */}
      <div style={s.content}>
        <div style={s.inner}>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ ...s.card, height: 80, opacity: 0.2 }} />
              ))}
            </div>
          ) : (
            <div style={s.mainRow}>

              {/* LANYARD */}
              <div style={s.lanyardCol}>
                <LanyardBadge username={username} year={year} />
              </div>

              {/* CARDS */}
              <div style={s.cardsCol}>

                {/* Year + Activity */}
                <div style={s.twoCol}>

                  <div style={s.card}>
                    <div style={s.cardLabel}>YEAR OF STUDY</div>
                    <select style={s.select} value={newYear} onChange={e => setNewYear(e.target.value)}>
                      <option value="">Select year…</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                      <option value="Graduate Studies">Graduate Studies</option>
                    </select>
                    <button style={s.btnPrimary} onClick={changeYear}>Save Year</button>
                  </div>

                  <div style={s.card}>
                    <div style={s.cardLabel}>ACTIVITY</div>
                    <div style={s.bigNum}>{groupCount}</div>
                    <div style={s.subTxt}>Groups Joined</div>
                    <div style={{ ...s.subTxt, marginTop: 6 }}>
                      {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div style={s.card}>
                  <div style={s.cardLabel}>MY COURSES</div>
                  {courses.length === 0 ? (
                    <div style={s.emptyNote}>No courses added yet.</div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {courses.map((code, i) => (
                        <span key={i} style={s.pill}>
                          {code}
                          <span style={s.pillX} onClick={() => removeCourse(code)}>×</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={s.addRow}>
                    <input style={s.input} placeholder="e.g. EECS3311"
                      value={newCourse} onChange={e => setNewCourse(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addCourseToUser()}
                      onFocus={e => e.target.style.borderColor="#6366f1"}
                      onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                    <button style={s.btnPrimarySm} onClick={addCourseToUser}>+ Add</button>
                  </div>
                </div>

                {/* Update Info */}
                <div style={s.card}>
                  <div style={s.cardLabel}>UPDATE YOUR INFO</div>
                  <div style={s.addRow}>
                    <input style={s.input} placeholder="Change Your Username"
                      onChange={e => changeUsername(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && changeUserName()}
                      onFocus={e => e.target.style.borderColor="#6366f1"}
                      onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                    <button style={s.btnPrimarySm} onClick={changeUserName}>Save</button>
                  </div>
                  <div style={{ ...s.addRow, marginTop: 8 }}>
                    <input style={s.input} placeholder="Change Your Password" type="password"
                      onChange={e => changePass(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && changePassword()}
                      onFocus={e => e.target.style.borderColor="#6366f1"}
                      onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.08)"} />
                    <button style={s.btnPrimarySm} onClick={changePassword}>Save</button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes blob {
          0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
        }
        input::placeholder { color: #334155; }
        input:focus, select:focus { outline: none; }
        * { box-sizing: border-box; }
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
  ghostBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "8px 14px",
    color: "#94a3b8", fontSize: 12, fontWeight: 500,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  content: {
    display: "flex", justifyContent: "center",
    padding: "28px 28px 60px",
    position: "relative", zIndex: 1,
  },
  inner: { width: "100%", maxWidth: 860, display: "flex", flexDirection: "column", gap: 14 },
  mainRow: { display: "flex", gap: 18, alignItems: "flex-start" },
  lanyardCol: { flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" },
  cardsCol: { flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16, padding: "18px 20px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  cardLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: 2,
    color: "#475569", marginBottom: 12, textTransform: "uppercase",
  },
  select: {
    width: "100%", height: 40, padding: "0 32px 0 12px",
    borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)", color: "#f1f5f9",
    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    outline: "none", appearance: "none", cursor: "pointer",
    marginBottom: 10, boxSizing: "border-box",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 10,
    padding: "10px 16px", color: "#fff",
    fontWeight: 600, fontSize: 13, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
    width: "100%",
  },
  btnPrimarySm: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 8,
    padding: "0 16px", color: "#fff",
    fontWeight: 600, fontSize: 12, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    flexShrink: 0, height: 40,
    whiteSpace: "nowrap",
  },
  bigNum: { fontSize: 36, fontWeight: 800, color: "#f1f5f9", lineHeight: 1, margin: "6px 0 2px" },
  subTxt: { fontSize: 11, color: "#475569", margin: 0 },
  pill: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
    color: "#a5b4fc", borderRadius: 20, padding: "4px 12px",
    fontSize: 11, fontWeight: 600,
  },
  pillX: {
    color: "#6366f1", fontSize: 15, cursor: "pointer",
    lineHeight: 1, transition: "color 0.15s", fontWeight: 700,
  },
  emptyNote: { fontSize: 12, color: "#334155", marginBottom: 8, fontStyle: "italic" },
  addRow: { display: "flex", gap: 8, alignItems: "center" },
  input: {
    flex: 1, height: 40, padding: "0 14px",
    borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)", color: "#f1f5f9",
    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
};

export default Profile;