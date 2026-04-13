import { useEffect, useRef } from "react";

function CursorSpotlight() {
  const spotRef = useRef(null);

  useEffect(() => {
    const el = spotRef.current;
    const move = (e) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.style.opacity = "1";
    };
    const leave = () => { el.style.opacity = "0"; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      style={{
        position: "fixed",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 2,
        opacity: 0,
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(200,16,46,0.08) 0%, rgba(200,16,46,0.03) 40%, transparent 70%)",
        transition: "opacity 0.3s ease",
      }}
    />
  );
}

export default CursorSpotlight;
