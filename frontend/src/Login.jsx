import React from 'react';
import TopbarGlobe from './TopbarGlobe';
 
function Login({
  loginUsername,
  loginPassword,
  setLoginUsername,
  setLoginPassword,
  loginUserFunc,
  loading,
  createUser,
  name,
  password,
  setName,
  setPassword,
}) {
  return (
    <div className="login-page">
      <div className="login-bg-overlay"></div>
      <div className="glass-card">
        <header className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <TopbarGlobe size={38} />
            <h1 className="logo-text" style={{ margin: 0 }}>CampusConnect</h1>
          </div>
          <p className="subtitle">York University Study Group Platform</p>
        </header>
 
        <section className="form-section">
          <h2>Create Account</h2>
          <input type="text" placeholder="Enter Username" value={name} onChange={(e) => setName(e.target.value)} className="glass-input" />
          <input type="password" placeholder="Set Password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input" />
          <button onClick={createUser} className="primary-signup-btn" disabled={!name || !password}>Sign Up</button>
        </section>
 
        <div className="form-separator"><span className="or-text">OR</span></div>
 
        <section className="form-section">
          <h2>Login to Your Sphere</h2>
          <input type="text" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} className="glass-input" />
          <input type="password" placeholder="Enter Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="glass-input" />
          <button onClick={loginUserFunc} className="primary-login-btn" disabled={!loginUsername || !loginPassword || loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </section>
      </div>
    </div>
  );
}
 
export default Login;