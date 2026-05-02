import React from 'react';
import TopbarGlobe from './TopbarGlobe';

function Login({
  loginUsername, loginPassword, setLoginUsername, setLoginPassword,
  loginUserFunc, loading, createUser, name, password, setName, setPassword,
}) {
  return (
    <div style={s.page}>
      {/* Background blobs matching landing page */}
      <div style={{...s.blob, ...s.blob1}} />
      <div style={{...s.blob, ...s.blob2}} />
      <div style={{...s.blob, ...s.blob3}} />

      {/* Back to home */}
      <a href="/" style={s.backBtn}>← Back to Home</a>

      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logoRow}>
            <TopbarGlobe size={32} />
            <span style={s.logoText}>CampusConnect</span>
          </div>
          <p style={s.subtitle}>York University Study Group Platform</p>
        </div>

        {/* Sign Up */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Create Account</h2>
          <input
            type="text" placeholder="Enter Username"
            value={name} onChange={e => setName(e.target.value)}
            style={s.input}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
          <input
            type="password" placeholder="Set Password"
            value={password} onChange={e => setPassword(e.target.value)}
            style={s.input}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
          <button
            onClick={createUser}
            disabled={!name || !password}
            style={{...s.btnPrimary, opacity: (!name || !password) ? 0.5 : 1}}
          >
            Sign Up
          </button>
        </div>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>OR</span>
          <div style={s.dividerLine} />
        </div>

        {/* Login */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Login to Your Sphere</h2>
          <input
            type="text" placeholder="Username"
            value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
            style={s.input}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
          <input
            type="password" placeholder="Enter Password"
            value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
            style={s.input}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
          <button
            onClick={loginUserFunc}
            disabled={!loginUsername || !loginPassword || loading}
            style={{...s.btnPrimary, opacity: (!loginUsername || !loginPassword || loading) ? 0.5 : 1}}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </div>

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
  @keyframes blob {
    0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
  }
  input::placeholder { color: #475569; }
  input:focus { outline: none; }
  button:hover { opacity: 0.9 !important; transform: translateY(-1px); }
  * { box-sizing: border-box; }
`}</style>
    </div>
  );
}

const s = {
  page: {
  minHeight: "100vh",
  background: "#070712",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'DM Sans', sans-serif",
  position: "relative",
  overflow: "hidden",
  padding: "40px 20px",
  width: "100%",       
  boxSizing: "border-box", 
},
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.12,
    animation: "blob 8s ease-in-out infinite",
    zIndex: 0,
  },
  blob1: { width: 400, height: 400, background: "#6366f1", top: "5%", left: "5%", animationDelay: "0s" },
  blob2: { width: 350, height: 350, background: "#8b5cf6", bottom: "10%", right: "5%", animationDelay: "3s" },
  blob3: { width: 300, height: 300, background: "#06b6d4", top: "50%", left: "40%", animationDelay: "5s" },

  backBtn: {
    position: "fixed", top: 20, left: 24,
    color: "#64748b", fontSize: 13, fontWeight: 500,
    textDecoration: "none", zIndex: 10,
    padding: "8px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    transition: "color 0.2s",
  },

  card: {
    width: "100%", maxWidth: 420,
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "36px 32px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
    position: "relative", zIndex: 1,
  },

  header: { textAlign: "center", marginBottom: 28 },
  logoRow: {
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: 10, marginBottom: 6,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22, fontWeight: 800, color: "#f1f5f9",
  },
  subtitle: { fontSize: 13, color: "#64748b" },

  section: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 16, fontWeight: 700,
    color: "#f1f5f9", marginBottom: 4,
  },

  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "13px 16px",
    color: "#f1f5f9", fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
    width: "100%",
  },

  btnPrimary: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 10,
    padding: "13px", color: "#fff",
    fontWeight: 600, fontSize: 15,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
    transition: "opacity 0.2s, transform 0.2s",
    width: "100%",
  },

  divider: {
    display: "flex", alignItems: "center",
    gap: 12, margin: "20px 0",
  },
  dividerLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.06)" },
  dividerText: { fontSize: 12, color: "#334155", fontWeight: 600 },
};

export default Login;