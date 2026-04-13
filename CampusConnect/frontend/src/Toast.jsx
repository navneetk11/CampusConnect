import { useState, useEffect, useCallback } from "react";

// Hook to use anywhere
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return { toasts, addToast };
}

// Individual toast
function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: { border: "rgba(0,255,180,0.3)", glow: "rgba(0,255,180,0.12)", icon: "✅" },
    error:   { border: "rgba(255,80,80,0.35)", glow: "rgba(255,80,80,0.12)", icon: "❌" },
    info:    { border: "rgba(80,160,255,0.3)", glow: "rgba(80,160,255,0.12)", icon: "ℹ️" },
  };
  const c = colors[toast.type] || colors.success;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "12px",
        background: "rgba(10,0,5,0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 20px ${c.glow}`,
        fontFamily: "Poppins, sans-serif",
        fontSize: "13px",
        color: "white",
        minWidth: "240px",
        maxWidth: "340px",
        cursor: "pointer",
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.95)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
      }}
      onClick={onRemove}
    >
      <span style={{ fontSize: 16 }}>{c.icon}</span>
      <span style={{ flex: 1, fontWeight: 500 }}>{toast.message}</span>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>×</span>
    </div>
  );
}

// Container — place once at the top level
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
}
