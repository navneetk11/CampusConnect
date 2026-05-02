import { useEffect, useRef, useState } from 'react';

const BACKEND_URL = 'https://campusconnect-8loz.onrender.com';

export default function GroupChat({ groupId, token, username }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const isNearBottom = useRef(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('fetchMessages error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  const handleScroll = () => {
    const el = messagesAreaRef.current;
    if (!el) return;
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const handleSend = async () => {
    if (file) handleUpload(file);
    const trimmed = inputText.trim();
    if (!trimmed) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ groupId, content: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setInputText('');
      fetchMessages();
    } catch (err) {
      setError('Could not send message');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      const res = await fetch(`${BACKEND_URL}/api/files/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      await fetch(`${BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ groupId, content: `${data.file.fileName}`, fileId: data.file._id, type: "file" }),
      });
      fetchMessages();
    } catch (error) { console.log(error); }
  };

  const handleDownload = async (fileId, fileUrl) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/files/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = fileUrl; a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) { console.log(error); }
  };

  const handleDelete = async (messageId, fileId) => {
    try {
      if (fileId != null) {
        await fetch(`${BACKEND_URL}/api/files/delete/${fileId}`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
        });
      }
      const res = await fetch(`${BACKEND_URL}/api/messages/${messageId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Could not delete');
        setTimeout(() => setError(''), 3000);
        return;
      }
      fetchMessages();
    } catch (err) { console.error(err); }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>💬 Group Chat</span>
        <span style={s.pollNote}>Refreshes every 5s</span>
      </div>

      {error && <div style={s.errorBanner}>{error}</div>}

      {/* Messages */}
      <div style={s.messagesArea} ref={messagesAreaRef} onScroll={handleScroll}>
        {loading && <p style={s.emptyState}>Loading messages...</p>}
        {!loading && messages.length === 0 && (
          <p style={s.emptyState}>No messages yet. Say hello! 👋</p>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderName === username;
          return (
            <div key={msg._id} style={{ ...s.messageRow, justifyContent: isMe ? "flex-end" : "flex-start" }}>
              {!isMe && (
                <div style={s.avatar}>{msg.senderName.charAt(0).toUpperCase()}</div>
              )}

              <div style={{ maxWidth: "65%" }}>
                {!isMe && <div style={s.senderName}>{msg.senderName}</div>}

                <div style={{
                  ...s.bubble,
                  background: isMe
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.07)",
                  borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  border: isMe ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}>
                  {msg.type === "file" ? (
                    <span onClick={() => handleDownload(msg.fileUrl, msg.content)}
                      style={{ cursor: "pointer", textDecoration: "underline", display: "flex", alignItems: "center", gap: 4, color: isMe ? "#c7d2fe" : "#93c5fd" }}>
                      🔗 {msg.content}
                    </span>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>

                <div style={{ ...s.timestamp, textAlign: isMe ? "right" : "left" }}>
                  {formatTime(msg.createdAt)}
                  {isMe && (
                    <span style={s.deleteBtn} onClick={() => handleDelete(msg._id, msg.fileUrl)}>
                      {" "}· delete
                    </span>
                  )}
                </div>
              </div>

              {isMe && (
                <div style={{ ...s.avatar, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", marginLeft: 8, marginRight: 0 }}>
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={s.inputRow}>
        <input ref={fileInputRef} style={{ display: "none" }} type="file"
          onChange={e => setFile(e.target.files[0])} />
        <button onClick={() => fileInputRef.current.click()} style={s.fileBtn}>
          📎
        </button>
        {file && <span style={s.fileName}>{file.name}</span>}
        <textarea
          style={s.input} value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1} maxLength={2000}
        />
        <button style={{
          ...s.sendBtn,
          opacity: inputText.trim() || file ? 1 : 0.4,
          cursor: inputText.trim() || file ? "pointer" : "default",
        }}
          onClick={handleSend}
          disabled={!inputText.trim() && !file}>
          Send
        </button>
      </div>

      <style>{`
        textarea::placeholder { color: #334155; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
      `}</style>
    </div>
  );
}

const s = {
  wrapper: {
    background: "rgba(15,23,42,0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16, overflow: "hidden",
    display: "flex", flexDirection: "column",
    height: 420, marginTop: 0,
    color: "#f1f5f9",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(99,102,241,0.06)",
  },
  headerTitle: { fontWeight: 700, fontSize: 14, color: "#f1f5f9" },
  pollNote: { fontSize: 11, color: "#475569" },
  errorBanner: {
    background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5", fontSize: 13, padding: "8px 16px", textAlign: "center",
  },
  messagesArea: {
    flex: 1, overflowY: "auto", padding: 16,
    display: "flex", flexDirection: "column", gap: 12,
  },
  emptyState: {
    textAlign: "center", color: "#334155",
    fontSize: 13, marginTop: 80,
  },
  messageRow: { display: "flex", alignItems: "flex-end", gap: 8 },
  avatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, flexShrink: 0,
    color: "#94a3b8",
  },
  senderName: { fontSize: 11, color: "#475569", marginBottom: 3, paddingLeft: 4 },
  bubble: {
    padding: "10px 14px", fontSize: 14,
    lineHeight: 1.45, wordBreak: "break-word", color: "#f1f5f9",
  },
  timestamp: {
    fontSize: 10, color: "#334155",
    marginTop: 3, paddingLeft: 4, paddingRight: 4,
  },
  deleteBtn: { cursor: "pointer", color: "rgba(239,68,68,0.5)", fontSize: 10 },
  inputRow: {
    display: "flex", gap: 8, padding: "12px 16px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(7,7,18,0.5)",
    alignItems: "center",
  },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, color: "#f1f5f9",
    padding: "10px 14px", fontSize: 13,
    resize: "none", fontFamily: "'DM Sans', sans-serif",
  },
  fileBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, color: "#94a3b8",
    padding: "8px 12px", fontSize: 16,
    cursor: "pointer", flexShrink: 0,
  },
  fileName: {
    fontSize: 11, color: "#64748b",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "6px 10px",
    maxWidth: 100, overflow: "hidden",
    textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none",
    borderRadius: 10, padding: "10px 20px",
    fontWeight: 600, fontSize: 13,
    transition: "opacity 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    flexShrink: 0,
  },
};