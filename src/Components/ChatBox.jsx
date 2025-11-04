// src/Components/ChatBox.js - Updated for mobile viewport height fix
import React, { useEffect, useState, useRef } from "react";
import socket from "../Utils/Socket";
import axiosInstance from "../Utils/axiosInstance";
import './ChatBox.css';

const ChatBox = ({ roomId, roomName: propRoomName }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState(propRoomName || "");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const usernameRef = useRef("Anonymous");
  const isMountedRef = useRef(false);
  const chatBoxRef = useRef(null);

  // Fix for mobile viewport height (address bar issues)
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);

    return () => window.removeEventListener('resize', setVh);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/users/me");
        usernameRef.current = response.data.username || "Anonymous";
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        usernameRef.current = "Anonymous";
      }
    };

    const fetchRoomName = async (roomId) => {
      if (propRoomName) {
        setRoomName(propRoomName);
        return;
      }
      try {
        const response = await axiosInstance.get(`/rooms/${roomId}`);
        setRoomName(response.data.name || "Unnamed Room");
      } catch (error) {
        console.error("Failed to fetch room name:", error);
        setRoomName("Unknown Room");
      }
    };

    const handleIncomingMessage = (payload) => {
      if (!isMountedRef.current) return;
      setMessages(prev => {
        const exists = prev.some(m =>
          (m._id && payload._id && m._id === payload._id) ||
          (m.tempId && payload.tempId && m.tempId === payload.tempId)
        );
        return exists ? prev : [...prev, payload];
      });
    };

    const handleRoomHistory = (history) => {
      console.log("✅ Received room history:", history);
      if (isMountedRef.current) {
        setMessages(history);
      }
    };

    const handleMessageDelivered = (confirmedMessage) => {
      if (!isMountedRef.current) return;
      setMessages(prev => prev.map(msg =>
        (msg.tempId === confirmedMessage.tempId && msg.username === usernameRef.current)
          ? { ...confirmedMessage, isPending: false }
          : msg
      ));
    };

    const initializeSocket = async () => {
      await fetchUserInfo();
      socket.on("receive-message", handleIncomingMessage);
      socket.on("room-history", handleRoomHistory);
      socket.on("message-delivered", handleMessageDelivered);
      if (roomId) {
        socket.emit("join-room", { roomId, username: usernameRef.current });
        await fetchRoomName(roomId);
      }
      setIsLoading(false);
    };

    initializeSocket();

    return () => {
      isMountedRef.current = false;
      socket.off("receive-message", handleIncomingMessage);
      socket.off("room-history", handleRoomHistory);
      socket.off("message-delivered", handleMessageDelivered);
    };
  }, [roomId, propRoomName]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const tempId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageData = {
      roomId,
      message: message.trim(),
      username: usernameRef.current,
      time: new Date().toISOString(),
      tempId
    };
    setMessages(prev => [...prev, { ...messageData, isPending: true }]);
    socket.emit("send-message", messageData);
    setMessage("");
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const generateMessageKey = (msg) => {
    return msg._id || msg.tempId || `${msg.time}-${msg.username}-${msg.message.substring(0, 10)}`;
  };

  const isCurrentUser = (username) => {
    return username === usernameRef.current;
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="chat-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="channel-info">
            <span className="channel-icon">#</span>
            <h2 className="channel-name">{roomName}</h2>
          </div>
        </div>
      </div>
      <div ref={chatBoxRef} className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <h3 className="empty-title">Welcome to #{roomName}</h3>
            <p className="empty-description">This is the beginning of your conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={generateMessageKey(msg)}
              className={`message ${isCurrentUser(msg.username) ? 'my-message' : 'other-message'} ${msg.isPending ? 'pending' : ''}`}
            >
              {!isCurrentUser(msg.username) && (
                <div className="message-avatar">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="message-content">
                {!isCurrentUser(msg.username) && (
                  <div className="message-header">
                    <span className="message-username">{msg.username}</span>
                    <span className="message-time">{formatTime(msg.time)}</span>
                  </div>
                )}
                <div className="message-bubble">
                  <span className="message-text">{msg.message}</span>
                  {isCurrentUser(msg.username) && (
                    <div className="message-meta">
                      <span className="message-time">{formatTime(msg.time)}</span>
                      <span className="message-status">
                        {msg.isPending ? (
                          <span className="status-sending">⏳</span>
                        ) : (
                          <span className="status-sent">✓</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            value={message}
            placeholder={`Message #${roomName}`}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="message-input"
            rows="1"
            style={{ color: 'white' }}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`send-button ${isTyping ? 'typing' : ''}`}
          >
            <span className="send-icon">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;