import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const styles = {
  chatWindow: {
    position: "fixed", bottom: "30px", right: "30px", width: "380px", height: "550px",
    backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1000,
    border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif", animation: "slideUp 0.3s ease-out"
  },
  header: {
    background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)", padding: "1rem", color: "#fff",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  },
  headerTitle: { fontWeight: 700, fontSize: "0.95rem", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  closeBtn: { background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer" },
  messagesArea: { flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.8rem", backgroundColor: "#F9FAFB" },
  messageBubble: (isUser) => ({
    maxWidth: "85%", padding: "0.8rem 1rem", borderRadius: "12px", fontSize: "0.9rem", lineHeight: "1.5",
    alignSelf: isUser ? "flex-end" : "flex-start",
    backgroundColor: isUser ? "#FF9500" : "#FFFFFF",
    color: isUser ? "#fff" : "#1F2937",
    border: isUser ? "none" : "1px solid #E5E7EB",
    borderBottomRightRadius: isUser ? "0" : "12px", borderBottomLeftRadius: isUser ? "12px" : "0",
    boxShadow: isUser ? "0 2px 5px rgba(255, 149, 0, 0.2)" : "0 1px 2px rgba(0,0,0,0.05)"
  }),
  inputArea: { padding: "1rem", borderTop: "1px solid #E5E7EB", display: "flex", gap: "0.5rem", background: "#fff" },
  input: { flex: 1, padding: "0.8rem", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", fontSize: "0.9rem" },
  sendBtn: { background: "#111827", color: "#fff", border: "none", borderRadius: "8px", padding: "0 1.2rem", cursor: "pointer", fontWeight: 600 }
};

export default function ChatBot({ repo, onClose }) {
  const repoName = repo.full_name || repo.name || "this repository";
  const [messages, setMessages] = useState([{ text: `Hi! Ask me anything about ${repoName}.`, isUser: false }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/github/chat", {
        repoContext: {
          name: repoName,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count
        },
        question: userMsg.text
      });
      setMessages((prev) => [...prev, { text: response.data.answer, isUser: false }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Connection error. Please try again.", isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <div style={styles.chatWindow}>
        <div style={styles.header}>
          <div><span style={{fontSize: "0.7rem", opacity: 0.8, textTransform: "uppercase"}}>Assistant</span><div style={styles.headerTitle}>{repoName}</div></div>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div style={styles.messagesArea}>
          {messages.map((msg, i) => (<div key={i} style={styles.messageBubble(msg.isUser)}>{msg.text}</div>))}
          {isTyping && <div style={{...styles.messageBubble(false), fontStyle: "italic", color: "#9CA3AF"}}>AI is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div style={styles.inputArea}>
          <input style={styles.input} placeholder="Ask anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSend()} />
          <button style={styles.sendBtn} onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
}