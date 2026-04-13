const LANYARD_STYLES = `
  @keyframes ss-drop-in {
    0%   { transform: translateY(-80px); opacity: 0; }
    60%  { transform: translateY(8px);   opacity: 1; }
    80%  { transform: translateY(-4px); }
    100% { transform: translateY(0px);   opacity: 1; }
  }
  @keyframes ss-swing {
    0%,100% { transform: rotateZ(-1.5deg); }
    50%      { transform: rotateZ(1.5deg);  }
  }
  .ss-lanyard-root {
    display: flex; flex-direction: column; align-items: center;
    transform-origin: top center;
    animation: ss-drop-in 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) forwards,
               ss-swing 5s ease-in-out 1s infinite;
  }
  .ss-cord-wrap { display: flex; gap: 16px; height: 52px; align-items: flex-start; }
  .ss-cord {
    width: 12px; height: 60px; border-radius: 4px;
    background:
      repeating-linear-gradient(
        120deg,
        rgba(255,255,255,0.0) 0px,
        rgba(255,255,255,0.18) 2px,
        rgba(255,255,255,0.0) 4px,
        rgba(255,255,255,0.08) 8px,
        rgba(255,255,255,0.0) 12px
      ),
      linear-gradient(160deg, #6b2030 0%, #8b3a4a 30%, #7a2d3d 50%, #5a1828 70%, #7c3040 100%);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1), 1px 0 3px rgba(0,0,0,0.4);
  }
  .ss-clip-body {
    width: 40px; height: 16px; margin: 0 auto -1px;
    background: linear-gradient(135deg, #c47060 0%, #a05040 40%, #b86050 70%, #c47060 100%);
    border-radius: 3px 3px 0 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,200,0.3);
    position: relative; z-index: 2;
  }
  .ss-clip-teeth {
    width: 24px; height: 6px; margin: 0 auto -1px;
    background: linear-gradient(135deg, #b05a48 0%, #904030 100%);
    border-radius: 0 0 4px 4px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.5);
  }
  .ss-badge {
    width: 180px;
    background:
      repeating-linear-gradient(
        135deg,
        rgba(180,160,160,0.07) 0px,
        rgba(255,255,255,0.0)  3px,
        rgba(200,180,180,0.05) 6px,
        rgba(255,255,255,0.0)  9px
      ),
      linear-gradient(160deg, #f5f0ee 0%, #ede5e2 40%, #f8f3f1 60%, #ede0dc 100%);
    border: 1px solid rgba(180,120,100,0.25);
    border-top: 1px solid rgba(220,180,160,0.4);
    border-radius: 14px;
    padding: 20px 20px 18px;
    text-align: center;
    position: relative;
    box-shadow:
      0 30px 60px rgba(0,0,0,0.55),
      0 10px 20px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.9),
      5px 0 14px rgba(0,0,0,0.2),
      -5px 0 14px rgba(0,0,0,0.2);
  }
  .ss-badge::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #904030, #c47060, #e8a090, #c47060, #904030);
    border-radius: 14px 14px 0 0;
  }
  .ss-badge::after {
    content: '';
    position: absolute; top: 10%; left: 0; width: 3px; height: 80%;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent);
    border-radius: 0 2px 2px 0;
  }
  .ss-badge-org {
    font-size: 8px; font-weight: 700; letter-spacing: 3px;
    color: #a05848; text-transform: uppercase;
    margin-bottom: 12px; font-family: Poppins, sans-serif;
  }
  .ss-badge-avatar-wrap { position: relative; display: inline-block; margin-bottom: 10px; }
  .ss-badge-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #c47060 0%, #904030 100%);
    border: 2px solid rgba(180,80,60,0.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 800; color: #fff;
    box-shadow: 0 0 0 4px rgba(180,80,60,0.12), 0 4px 12px rgba(0,0,0,0.25);
    font-family: Poppins, sans-serif;
  }
  .ss-avatar-ring {
    position: absolute; inset: -4px; border-radius: 50%;
    border: 1px solid rgba(180,80,60,0.25);
  }
  .ss-badge-name {
    font-size: 18px; font-weight: 800; color: #3a1810;
    letter-spacing: -0.5px; margin-bottom: 3px;
    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
    font-family: Poppins, sans-serif;
  }
  .ss-badge-sub {
    font-size: 9px; color: rgba(80,30,20,0.45);
    letter-spacing: 1.5px; text-transform: uppercase;
    font-family: Poppins, sans-serif;
  }
  .ss-badge-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(160,80,60,0.2), transparent);
    margin: 12px 0;
  }
  .ss-badge-pills { display: flex; justify-content: center; gap: 5px; flex-wrap: wrap; }
  .ss-pill {
    background: rgba(180,80,60,0.12);
    border: 1px solid rgba(180,80,60,0.3);
    color: #904030; border-radius: 20px;
    padding: 3px 10px; font-size: 9px; font-weight: 700;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 4px rgba(180,80,60,0.1);
    font-family: Poppins, sans-serif;
  }
`;

/* Map short year values to full labels */
const YEAR_LABELS = {
  "1st": "1st Year",
  "2nd": "2nd Year",
  "3rd": "3rd Year",
  "4th": "4th Year",
  "Graduate Studies": "Graduate Studies",
};

function LanyardBadge({ username, year }) {
  const initials = username ? username.slice(0, 2).toUpperCase() : "??";
  const fullYear = YEAR_LABELS[year] || year;

  return (
    <>
      <style>{LANYARD_STYLES}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8 }}>
        <div className="ss-lanyard-root">
          <div className="ss-cord-wrap">
            <div className="ss-cord" />
            <div className="ss-cord" />
          </div>
          <div className="ss-clip-body" />
          <div className="ss-clip-teeth" />
          <div className="ss-badge">
            <div className="ss-badge-org">CampusConnect</div>
            <div className="ss-badge-avatar-wrap">
              <div className="ss-badge-avatar">{initials}</div>
              <div className="ss-avatar-ring" />
            </div>
            <div className="ss-badge-name">{username || "..."}</div>
            <div className="ss-badge-sub">York University</div>
            <div className="ss-badge-divider" />
            <div className="ss-badge-pills">
              {fullYear && fullYear !== "Not Assigned" && (
                <span className="ss-pill">{fullYear}</span>
              )}
              <span className="ss-pill">Member</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LanyardBadge;