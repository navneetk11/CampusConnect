import { useEffect, useRef } from "react";

function TopbarGlobe({ size = 44 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;
    canvas.width = size * DPR;
    canvas.height = size * DPR;
    ctx.scale(DPR, DPR);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.42;

    const NUM = 120;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const dots = [];
    for (let i = 0; i < NUM; i++) {
      const y = 1 - (i / (NUM - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = GA * i;
      dots.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
    }

    const conns = [];
    for (let i = 0; i < NUM; i++)
      for (let j = i + 1; j < NUM; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dz = dots[i].z - dots[j].z;
        if (dx * dx + dy * dy + dz * dz < 0.22) conns.push([i, j]);
      }

    const TILT = 0.3;
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cosA = Math.cos(angle), sinA = Math.sin(angle);

      const proj = dots.map(d => {
        const rx = d.x * cosA - d.z * sinA;
        const rz = d.x * sinA + d.z * cosA;
        const tx = rx;
        const ty = d.y * cosT - rz * sinT;
        const tz = d.y * sinT + rz * cosT;
        const sc = (tz + 2.2) / 3.2;
        return { px: cx + tx * R * sc, py: cy + ty * R * sc, tz, sc };
      });

      // connections
      conns.forEach(([i, j]) => {
        const a = proj[i], b = proj[j];
        const vis = ((a.tz + b.tz) / 2 + 1) / 2;
        if (vis < 0.1) return;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.strokeStyle = `rgba(255, 80, 100, ${vis * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // dots back to front
      proj
        .map((p, i) => ({ ...p, i }))
        .sort((a, b) => a.tz - b.tz)
        .forEach(({ px, py, tz, sc }) => {
          const vis = (tz + 1) / 2;
          const dotR = sc * 1.5;

          // glow
          const grad = ctx.createRadialGradient(px, py, 0, px, py, dotR * 6);
          grad.addColorStop(0, `rgba(255, 60, 90, ${vis * 0.55})`);
          grad.addColorStop(0.4, `rgba(200, 16, 46, ${vis * 0.2})`);
          grad.addColorStop(1, "rgba(200,16,46,0)");
          ctx.beginPath();
          ctx.arc(px, py, dotR * 6, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // white halo
          ctx.beginPath();
          ctx.arc(px, py, dotR + 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.1 + vis * 0.45})`;
          ctx.fill();

          // red dot
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, dotR), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, ${Math.round(60 * vis)}, ${Math.round(80 * vis)}, ${0.7 + vis * 0.3})`;
          ctx.fill();
        });

      angle += 0.005;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

export default TopbarGlobe;
