import { useState, useEffect } from "react";
import TopbarGlobe from "./TopbarGlobe";
import CursorSpotlight from "./CursorSpotlight";
import LanyardBadge from "./LanyardBadge";

/* ── inline styles scoped to Profile only ── */
const S = {
  page: {
    display: "flex", flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    padding: "28px 28px 60px",
  },
  inner: {
    width: "100%",
    maxWidth: "860px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  /* Main row: lanyard pinned left, cards right */
  mainRow: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
  },
  lanyardCol: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardsCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: 0,
  },

  /* Compact card shell — no override, uses glass-card + dash-panel */
  card: {
    padding: "16px 18px",
    boxSizing: "border-box",
  },

  /* Row of two equal mini-cards */
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.75)",
    marginBottom: 10,
  },

  /* Year select */
  select: {
    width: "100%",
    height: 38,
    padding: "0 32px 0 12px",
    borderRadius: 9,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.45)",
    color: "white",
    fontSize: 13,
    fontFamily: "Poppins, sans-serif",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    cursor: "pointer",
    marginBottom: 10,
    boxSizing: "border-box",
  },



  /* Activity numbers */
  bigNum: {
    fontSize: 36,
    fontWeight: 800,
    color: "white",
    lineHeight: 1,
    margin: "6px 0 2px",
  },
  subTxt: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    margin: 0,
  },

  /* Course pill */
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(200,16,46,0.14)",
    border: "1px solid rgba(200,16,46,0.28)",
    color: "#ff8090",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 11,
    fontWeight: 600,
  },
  pillX: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 15,
    cursor: "pointer",
    lineHeight: 1,
    transition: "color 0.15s",
  },

  /* Add course row */
  addRow: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  addInput: {
    flex: 1,
    height: 38,
    padding: "0 14px",
    borderRadius: 9,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.4)",
    color: "white",
    fontSize: 13,
    fontFamily: "Poppins, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  },


  emptyNote: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    margin: "4px 0 8px",
    fontStyle: "italic",
  },
};

function Profile({ currentUser, onBack, addToast }) {
  const [username, setUsername] = useState("");
  const [courses, setCourses] = useState([]);
  const [year, setYear] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [groupCount, setGroupCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const[newPass, changePass] = useState("");
  const[newUsername, changeUsername] = useState("");


  useEffect(() => {
    if (!currentUser) { onBack(); return; }
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:2222/api/users/${currentUser}`);
      const data = await res.json();
      if (data.success) {
        setUsername(data.data.username);
        setYear(data.data.year || "Not Assigned");
        setNewYear(data.data.year || "");
        if (data.data.courses?.length > 0) {
          const courseData = await Promise.all(
            data.data.courses.map((c) => getCourseInfo(c))
          );
          setCourses(courseData.filter(Boolean));
        } else {
          setCourses([]);
        }
        setGroupCount(data.data.groups?.length || 0);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseInfo = async (courseID) => {
    try {
      const res = await fetch(`http://localhost:2222/api/courses/courseInfo/${courseID}`);
      if (res.ok) {
        const data = await res.json();
        return data.courseCode;
      }
    } catch (error) {
      console.error("Error getting course info", error);
    }
  };

  const changeYear = async () => {
    try {
      const res = await fetch(`http://localhost:2222/api/users/EditYear/${currentUser}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: newYear }),
      });
      const data = await res.json();
      if (data.success) setYear(data.year || newYear);
      addToast("Year of study updated!", "success");
    } catch (error) {
      console.error("Error updating year:", error);
    }
  };

  const removeCourse = async (courseCode) => {
    try {
      const res = await fetch(`http://localhost:2222/api/users/deleteCourse/${currentUser}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode }),
      });
      const data = await res.json();
      addToast("Course Removed", "success");
      if (data.success) getUser();
    } catch (error) {
      console.error("Error removing course:", error);
      addToast("Could not remove Course", "error");
    }
  };

  const addCourseToUser = async () => {
    if (!newCourse.trim()) return;
    try {
      const res = await fetch(`http://localhost:2222/api/users/addCourse/${currentUser}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode: newCourse }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCourse("");
        getUser();
        addToast("Course added successfully", "success");
      }
    } catch (error) {
      addToast("Could not add Course", "error");
      console.error("Error adding course:", error);
    }
  };

  const changeUserName = async() => {
        try{
            const res = await fetch(`http://localhost:2222/api/users/update/${currentUser}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUsername}),
            })
            const data = await res.json();
            //update token
            if(!data.success){
                throw new Error(data.message || "Failed to change password");
            }
            addToast("Username Updated", "success");
            getUser();
        }
        catch(error){
            addToast("Error updating User name", "error");
        }
    }

    const changePassword = async() => {
        try{
            const res = await fetch(`http://localhost:2222/api/users/update/${currentUser}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password:  newPass}),
            })
            const data = await res.json();
            //update token
            if(!data.success){
                throw new Error(data.message || "Failed to change password");
            }
            addToast("Password updated", "success");
            getUser();
        }
        catch(error){
            addToast("Error updating User password", "error");
            console.log("Error in changePass:", error)
        }
    }

  return (
    <div className="dashboard-page" style={S.page}>
      <div className="login-bg-overlay" />
      <CursorSpotlight />

      <div className="dash-body">
        {/* TOPBAR */}
        <header className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <TopbarGlobe size={44} />
            <div>
              <h1 className="logo-text" style={{ fontSize: 24, margin: 0 }}>StudySphere</h1>
              <p className="subtitle" style={{ margin: "2px 0 0", fontSize: 12 }}>
                York University Study Group Platform
              </p>
            </div>
          </div>
          <button className="dash-btn-ghost" onClick={onBack}>← Back</button>
        </header>

        {/* CONTENT */}
        <div style={S.content}>
          <div style={S.inner}>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{ ...S.card, height: 70, opacity: 0.3 }} />
                ))}
              </div>
            ) : (
              <>
                {/* ── MAIN ROW ── */}
                <div style={S.mainRow}>

                  {/* LANYARD — left anchor */}
                  <div style={S.lanyardCol}>
                    <LanyardBadge username={username} year={year} />
                  </div>

                  {/* CARDS column */}
                  <div style={S.cardsCol}>

                    {/* Top row: Year + Activity side-by-side */}
                    <div style={S.twoCol}>

                      {/* YEAR OF STUDY */}
                      <div className="glass-card dash-panel" style={S.card}>
                        <p style={S.label}>Year of Study</p>
                        <select
                          style={S.select}
                          value={newYear}
                          onChange={(e) => setNewYear(e.target.value)}
                        >
                          <option value="">Select year…</option>
                          <option value="1st">1st Year</option>
                          <option value="2nd">2nd Year</option>
                          <option value="3rd">3rd Year</option>
                          <option value="4th">4th Year</option>
                          <option value="Graduate Studies">Graduate Studies</option>
                        </select>
                        <button className="primary-signup-btn" style={{ height: 36, fontSize: 13, borderRadius: 9 }} onClick={changeYear}>Save Year</button>
                      </div>

                      {/* ACTIVITY */}
                      <div className="glass-card dash-panel" style={S.card}>
                        <p style={S.label}>Activity</p>
                        <p style={S.bigNum}>{groupCount}</p>
                        <p style={S.subTxt}>Groups Joined</p>
                        <p style={{ ...S.subTxt, marginTop: 6 }}>
                          {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
                        </p>
                      </div>
                    </div>

                    {/* COURSES — full-width under the two-col row */}
                    <div className="glass-card dash-panel" style={S.card}>
                      <p style={S.label}>My Courses</p>

                      {courses.length === 0 ? (
                        <p style={S.emptyNote}>No courses added yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                          {courses.map((code, i) => (
                            <span key={i} style={S.pill}>
                              {code}
                              <span
                                style={S.pillX}
                                onClick={() => removeCourse(code)}
                              >×</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={S.addRow}>
                        <input
                          style={S.addInput}
                          placeholder="e.g. EECS3311"
                          value={newCourse}
                          onChange={(e) => setNewCourse(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCourseToUser()}
                        />
                        <button className="primary-login-btn" style={{ height: 38, width: "auto", padding: "0 16px", fontSize: 12, borderRadius: 9, flexShrink: 0 }} onClick={addCourseToUser}>
                          + Add
                        </button>
                      </div>
                    </div> {/* /UserCourses */}

                      {/* USER INFO - Update Username and Password */}
                    <div className="glass-card dash-panel" style={S.card}>
                      <p style={S.label}>Update Your Info</p>

                      <div style={S.addRow}>
                        <input
                          style={S.addInput}
                          placeholder="Change Your Username"
                          onChange={(e) => changeUsername(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && changeUserName()}
                        />
                        <button className="primary-login-btn" style={{ height: 38, width: "auto", padding: "0 16px", fontSize: 12, borderRadius: 9, flexShrink: 0 }} onClick={changeUserName}>
                          Change Username
                        </button>
                      </div>
                      <div style={S.addRow}>
                        <input
                          style={S.addInput}
                          placeholder="Change Your Password"
                          onChange={(e) => changePass(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && changePassword()}
                        />
                        <button className="primary-login-btn" style={{ height: 38, width: "auto", padding: "0 16px", fontSize: 12, borderRadius: 9, flexShrink: 0 }} onClick={changePassword}>
                          Change Password
                        </button>
                      </div>
                    </div>{/* /UserInfo */}
                  </div>{/* /cardsCol */}
                </div>{/* /mainRow */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;