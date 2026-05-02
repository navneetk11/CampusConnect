import { useState, useEffect } from "react";

const features = [
  {
    icon: "⚡",
    title: "Real-Time Group Chat",
    desc: "Message your study group instantly with file sharing and live updates.",
  },
  {
    icon: "📅",
    title: "Session Scheduling",
    desc: "Create, reschedule, and track study sessions with attendance tracking.",
  },
  {
    icon: "🔍",
    title: "Smart Discovery",
    desc: "Find groups by course, department, or meeting mode — virtual or in-person.",
  },
  {
    icon: "📁",
    title: "File Sharing",
    desc: "Share notes, slides, and resources directly inside your group chat.",
  },
];



export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    setTimeout(() => setVisible(true), 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles.root}>
      {/* ── Noise texture overlay ── */}
      <div style={styles.noise} />

      {/* ── NAV ── */}
      <nav style={{ ...styles.nav, background: scrollY > 40 ? "rgba(10,10,20,0.92)" : "transparent" }}>
        <div style={styles.navLogo}>
          <span style={styles.logoIcon}>🎓</span>
          <span style={styles.logoText}>CampusConnect</span>
        </div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="/app" style={styles.navCta}>
            Open App →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={styles.hero}>
        {/* Animated blobs */}
        <div style={{ ...styles.blob, ...styles.blob1 }} />
        <div style={{ ...styles.blob, ...styles.blob2 }} />
        <div style={{ ...styles.blob, ...styles.blob3 }} />

        <div style={{ ...styles.heroContent, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s ease" }}>
          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            York University Student Platform
          </div>

          <h1 style={styles.heroTitle}>
            Study Smarter,<br />
            <span style={styles.heroAccent}>Together.</span>
          </h1>

          <p style={styles.heroSub}>
            CampusConnect brings your study groups, sessions, and conversations
            into one organized space — so you spend less time coordinating and
            more time learning.
          </p>

          <div style={styles.heroBtns}>
            <a href="/app" style={styles.btnPrimary}>
              Get Started Free
            </a>
            <a href="#features" style={styles.btnGhost}>
              See Features ↓
            </a>
          </div>

         
        </div>

        {/* Hero mockup card */}
        <div style={{ ...styles.mockupWrap, opacity: visible ? 1 : 0, transform: visible ? "translateY(0) rotate(-2deg)" : "translateY(40px)", transition: "all 1.1s ease 0.2s" }}>
          <div style={styles.mockupCard}>
            <div style={styles.mockupHeader}>
              <div style={styles.mockupDots}>
                <span style={{ ...styles.dot, background: "#ff5f57" }} />
                <span style={{ ...styles.dot, background: "#ffbd2e" }} />
                <span style={{ ...styles.dot, background: "#28c840" }} />
              </div>
              <span style={styles.mockupTitle}>EECS 3311 Study Group</span>
            </div>
            <div style={styles.mockupBody}>
              {[
                { name: "Sarah K.", msg: "Anyone free Thursday 4pm?", time: "2m ago", color: "#c084fc" },
                { name: "James L.", msg: "I'll be there! Bringing the slides 📎", time: "1m ago", color: "#60a5fa" },
                { name: "You", msg: "Perfect, I'll book the library room", time: "just now", color: "#34d399" },
              ].map((m) => (
                <div key={m.name} style={styles.mockupMsg}>
                  <div style={{ ...styles.avatar, background: m.color }}>{m.name[0]}</div>
                  <div>
                    <div style={styles.msgName}>{m.name} <span style={styles.msgTime}>{m.time}</span></div>
                    <div style={styles.msgText}>{m.msg}</div>
                  </div>
                </div>
              ))}
              <div style={styles.mockupSession}>
                <span>📅</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>Next Session</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Thursday, 4:00 PM · Scott Library</div>
                </div>
                <span style={styles.sessionBadge}>Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionLabel}>WHAT YOU GET</div>
        <h2 style={styles.sectionTitle}>Everything your study group needs</h2>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={f.title} style={{ ...styles.featureCard, animationDelay: `${i * 0.1}s` }}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Ready to study smarter?</h2>
          <p style={styles.ctaSub}>Join hundreds of York University students already using CampusConnect.</p>
          <div style={styles.heroBtns}>
            <a href="/app" style={styles.btnPrimary}>
              Create Your Account →
            </a>
            <a href="/app" style={styles.btnGhost}>
              Log In
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <span style={styles.logoText}>🎓 CampusConnect</span>
        <span style={{ color: "#334155", fontSize: 13 }}>Built for York University Students</span>
      </footer>

      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: #070712 !important; }
  a { text-decoration: none; }
  @keyframes blob { 
    0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; } 
  }
`}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#070712",
    fontFamily: "'DM Sans', sans-serif",
    color: "#f1f5f9",
    overflowX: "hidden",
    position: "relative",
  },
  noise: {
    position: "fixed", inset: 0, zIndex: 0,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
    pointerEvents: "none", opacity: 0.4,
  },

  // NAV
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 48px",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "background 0.3s ease",
  },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 22 },
  logoText: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
  navLinks: { display: "flex", alignItems: "center", gap: 24 },
  navLink: { color: "#94a3b8", fontSize: 14, fontWeight: 500, transition: "color 0.2s" },
  navCta: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontSize: 14, fontWeight: 600,
    padding: "9px 20px", borderRadius: 8,
    transition: "opacity 0.2s",
  },

  // HERO
  hero: {
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "120px 48px 80px",
    position: "relative",
    gap: 60,
    flexWrap: "wrap",
  },
  blob: {
    position: "absolute", borderRadius: "50%",
    filter: "blur(80px)", opacity: 0.12,
    animation: "blob 8s ease-in-out infinite",
    zIndex: 0,
  },
  blob1: { width: 500, height: 500, background: "#6366f1", top: "10%", left: "5%", animationDelay: "0s" },
  blob2: { width: 400, height: 400, background: "#8b5cf6", top: "20%", right: "10%", animationDelay: "3s" },
  blob3: { width: 350, height: 350, background: "#06b6d4", bottom: "10%", left: "30%", animationDelay: "5s" },

  heroContent: { maxWidth: 560, zIndex: 1, position: "relative" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#a5b4fc",
    fontWeight: 500, marginBottom: 28, letterSpacing: 0.5,
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%", background: "#6366f1",
    boxShadow: "0 0 6px #6366f1",
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(40px, 6vw, 68px)",
    fontWeight: 800, lineHeight: 1.1,
    color: "#f8fafc", marginBottom: 20,
  },
  heroAccent: {
    background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #06b6d4 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 17, color: "#94a3b8", lineHeight: 1.7,
    marginBottom: 36, maxWidth: 460,
  },
  heroBtns: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 },
  btnPrimary: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontWeight: 600, fontSize: 15,
    padding: "13px 28px", borderRadius: 10,
    boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
    transition: "transform 0.2s, box-shadow 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnGhost: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#cbd5e1", fontWeight: 500, fontSize: 15,
    padding: "13px 28px", borderRadius: 10,
    transition: "background 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },

 
  // MOCKUP
  mockupWrap: { zIndex: 1, position: "relative" },
  mockupCard: {
    width: 320,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
    backdropFilter: "blur(20px)",
  },
  mockupHeader: {
    background: "rgba(99,102,241,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "12px 16px",
    display: "flex", alignItems: "center", gap: 10,
  },
  mockupDots: { display: "flex", gap: 5 },
  dot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  mockupTitle: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  mockupBody: { padding: 16, display: "flex", flexDirection: "column", gap: 14 },
  mockupMsg: { display: "flex", gap: 10, alignItems: "flex-start" },
  avatar: {
    width: 28, height: 28, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  msgName: { fontSize: 11, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 },
  msgTime: { fontSize: 10, color: "#475569", fontWeight: 400, marginLeft: 6 },
  msgText: { fontSize: 12, color: "#94a3b8", lineHeight: 1.4 },
  mockupSession: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 10, padding: "10px 12px", marginTop: 4,
    fontSize: 16,
  },
  sessionBadge: {
    marginLeft: "auto", fontSize: 10, fontWeight: 700,
    background: "rgba(34,197,94,0.15)", color: "#4ade80",
    padding: "3px 8px", borderRadius: 20,
  },

  // FEATURES
  featuresSection: {
    padding: "100px 48px",
    maxWidth: 1100, margin: "0 auto",
    position: "relative", zIndex: 1,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: 3,
    color: "#6366f1", marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 800, color: "#f1f5f9",
    marginBottom: 48,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  featureCard: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14, padding: "28px 24px",
    transition: "border-color 0.2s, transform 0.2s",
    cursor: "default",
  },
  featureIcon: { fontSize: 28, marginBottom: 14 },
  featureTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 16, fontWeight: 700,
    color: "#f1f5f9", marginBottom: 8,
  },
  featureDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6 },

  // CTA
  ctaSection: {
    padding: "80px 48px",
    position: "relative", zIndex: 1,
  },
  ctaInner: {
    maxWidth: 600, margin: "0 auto",
    textAlign: "center",
    background: "rgba(99,102,241,0.06)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 20, padding: "60px 40px",
  },
  ctaTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(26px, 4vw, 38px)",
    fontWeight: 800, color: "#f1f5f9", marginBottom: 14,
  },
  ctaSub: { fontSize: 15, color: "#64748b", marginBottom: 32 },

  // FOOTER
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.05)",
    padding: "24px 48px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    position: "relative", zIndex: 1,
  },
};