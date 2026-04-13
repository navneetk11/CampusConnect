// PB-27: Group Chat Frontend Integration

import { useEffect, useRef, useState } from 'react';

const BACKEND_URL = 'http://localhost:5000';

export default function GroupChat({ groupId, token, username }) {
  const [messages, setMessages]   = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [file, setFile]           = useState(null);
  const fileInputRef              = useRef(null);
  const messagesAreaRef           = useRef(null);
  const isNearBottom              = useRef(true);

  // Fetch messages from backend 
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('fetchMessages error:', err);
    } finally {
      setLoading(false);
    }
  };

  //  Load messages on mount + poll every 5 seconds
  useEffect(() => {
    fetchMessages(); // immediate first load

    const interval = setInterval(fetchMessages, 5000); // refresh every 5s

    return () => clearInterval(interval); // cleanup on unmount
  }, [groupId]);

  // Track whether the user is near the bottom of the messages area
  const handleScroll = () => {
    const el = messagesAreaRef.current;
    if (!el) return;
    const threshold = 80; // px from bottom
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  // Send a message 
  const handleSend = async () => {
    if(file){
      handleUpload(file);
    }
    const trimmed = inputText.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId, content: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send message');
        setTimeout(() => setError(''), 3000);
        return;
      }

      setInputText('');
      fetchMessages(); // immediately refresh after sending
    } catch (err) {
      console.error('sendMessage error:', err);
      setError('Could not send message, try again');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Allow Enter key to send (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUpload = async(file) =>{
    try{
      const formData = new FormData();
      formData.append("file", file);
      setFile(null);
      fileInputRef.current.value = "";
      const res = await fetch(`${BACKEND_URL}/api/files/upload`,
        { method: 'POST',
          body: formData
    });
      const data = await res.json();
      console.log(data);
      if(!data.success){
        throw new Error(data.message);
      }

      //Call message api to make the file into a message
        await fetch(`${BACKEND_URL}/api/messages`, {
        method:'POST',
        headers:{ 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({groupId, content: `${data.file.fileName}`, fileId: data.file._id, type: "file"}),
      })

      fetchMessages();
    }
    catch(error){
      console.log(error);
    }
  }

  const handleDownload = async(fileId, fileUrl) =>{
    try{
      const res = await fetch(`${BACKEND_URL}/api/files/download/${fileId}`, 
        {headers: {
          Authorization: `Bearer ${token}`,
        }}
      ); //get file by it's ID
      console.log('pass');
      if(!res.ok){
        throw new Error("Failed to Download File");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      //Create a temp element which allows us to download the file
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl;
      a.click();

      window.URL.revokeObjectURL(url);
    }
    catch(error){
      console.log(error);
    }

  }
  //  Delete a message 
  const handleDelete = async (messageId, fileId) => {
    try {
      //delete file from DB if it has a file
      if(fileId != null){
        await fetch(`${BACKEND_URL}/api/files/delete/${fileId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      const res = await fetch(`${BACKEND_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Could not delete message');
        setTimeout(() => setError(''), 3000);
        return;
      }

      fetchMessages(); // refresh after delete
    } catch (err) {
      console.error('deleteMessage error:', err);
    }
  };

  //  Format timestamp 
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  
  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerTitle}>💬 Group Chat</span>
        <span style={styles.pollNote}>Refreshes every 5s</span>
      </div>

      {/* Error banner */}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Messages area */}
      <div style={styles.messagesArea} ref={messagesAreaRef} onScroll={handleScroll}>
        {loading && <p style={styles.emptyState}>Loading messages...</p>}

        {!loading && messages.length === 0 && (
          <p style={styles.emptyState}>No messages yet. Say hello! 👋</p>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderName === username;
          return (
            <div
              key={msg._id}
              style={{
                ...styles.messageRow,
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              {/* Other user avatar on left */}
              {!isMe && (
                <div style={styles.avatar}>
                  {msg.senderName.charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ maxWidth: "65%" }}>
                {/* Sender name for other people's messages */}
                {!isMe && <div style={styles.senderName}>{msg.senderName}</div>}

                <div
                  style={{
                    ...styles.bubble,
                    background: isMe ? "#d23a8e" : "rgba(255,255,255,0.12)",
                    borderRadius: isMe
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  }}
                >
                  {msg.type === "file" ? (
                    <span
                      onClick={() => handleDownload(msg.fileUrl, msg.content)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        display: "flex",
                        alignItems: "center",
                        color: isMe ? "#222277" : 'lightblue' ,
                      }}
                    >
                      {" "}
                      🔗{msg.content}
                    </span>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>

                <div
                  style={{
                    ...styles.timestamp,
                    textAlign: isMe ? "right" : "left",
                  }}
                >
                  {formatTime(msg.createdAt)}
                  {/* Show delete button only on your own messages */}
                  {isMe && (
                    <span
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(msg._id, msg.fileUrl)}
                      title="Delete message"
                    >
                      {" "}
                      · delete
                    </span>
                  )}
                </div>
              </div>

              {/* My avatar on right */}
              {isMe && (
                <div
                  style={{
                    ...styles.avatar,
                    background: "#c0392b",
                    marginLeft: 8,
                    marginRight: 0,
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* Input area */}
      <div style={styles.inputRow}>
        {/* Add input button that allows user to select a file, hide this element, replace with button */}
        <input
          ref={fileInputRef}
          style={{ display: "none" }}
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        ></input>
        <button
          onClick={() => fileInputRef.current.click()}
          style={styles.fileInput}
        >
          Add file
        </button>
        {file && (
  <span style={styles.fileName}>
    {file.name}
  </span>
)}
        <textarea
          style={styles.input}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          maxLength={2000}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: inputText.trim() || file ? 1 : 0.5,
            cursor: inputText.trim() || file ? "pointer" : "default",
          }}
          onClick={handleSend}
          disabled={!inputText.trim() && !file}
        >
          Send
        </button>
      </div>
    </div>
  );
}

//  Styles — matches CampusConnect glassmorphism aesthetic 
const styles = {
  wrapper: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '420px',
    marginTop: '24px',
    color: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: '15px',
  },
  pollNote: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  errorBanner: {
    background: 'rgba(192,57,43,0.85)',
    color: '#fff',
    fontSize: '13px',
    padding: '8px 16px',
    textAlign: 'center',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
    marginTop: '80px',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
    flexShrink: 0,
    marginRight: 8,
  },
  senderName: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: '3px',
    paddingLeft: '4px',
  },
  bubble: {
    padding: '10px 14px',
    fontSize: '14px',
    lineHeight: '1.45',
    wordBreak: 'break-word',
    color: '#fff',
  },
  timestamp: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.35)',
    marginTop: '3px',
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  deleteBtn: {
    cursor: 'pointer',
    color: 'rgba(255,100,100,0.6)',
    fontSize: '10px',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.15)',
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    color: '#fff',
    padding: '10px 14px',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
  fileInput: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    color: '#fff',
    padding: '10px 14px',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    width: '15%',
    cursor: 'pointer',
  },
  fileName: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    color: '#fff',
    padding: '10px 14px',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendBtn: {
    background: '#d23a8e',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'opacity 0.2s',
  },
};