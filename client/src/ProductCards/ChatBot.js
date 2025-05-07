import React, { useState } from "react";
import "./chatbot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(
        "https://campus-backend-sdry.onrender.com/chat-recommendation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong!" },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask for product suggestions..."
        />
        <button className="chat-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
