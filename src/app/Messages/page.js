"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSearch } from "@fortawesome/free-solid-svg-icons";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for conversations
  useEffect(() => {
    const fetchConversations = async () => {
      // Simulate fetching conversations from an API
      const fetchedConversations = [
        {
          id: 1,
          studentName: "John Doe",
          lastMessage: "Can you help me with the assignment?",
          timestamp: "2024-12-01T10:00:00",
        },
        {
          id: 2,
          studentName: "Jane Smith",
          lastMessage: "What is the class schedule for next week?",
          timestamp: "2024-12-01T11:30:00",
        },
        {
          id: 3,
          studentName: "Mark Johnson",
          lastMessage: "I missed the last class. Can you share the notes?",
          timestamp: "2024-12-01T14:00:00",
        },
      ];
      setConversations(fetchedConversations);
    };

    fetchConversations();
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      alert("Message sent: " + newMessage);
      setNewMessage("");
      // Simulate sending a message
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Sidebar (Conversations List) */}
      <div
        style={{
          width: "30%",
          backgroundColor: "#fff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          borderRadius: "12px 0 0 12px",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "2px solid #e0e0e0",
              paddingBottom: "8px",
            }}
          >
            <FontAwesomeIcon icon={faSearch} style={{ color: "#757575", marginRight: "8px" }} />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "none",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>
        </div>
        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
          {filteredConversations.map((conversation) => (
            <li
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              style={{
                padding: "16px",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                cursor: "pointer",
                marginBottom: "12px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e1f5f3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                  {conversation.studentName}
                </h3>
                <p style={{ fontSize: "12px", color: "#9e9e9e" }}>
                  {new Date(conversation.timestamp).toLocaleString()}
                </p>
              </div>
              <p style={{ fontSize: "14px", color: "#757575" }}>
                {conversation.lastMessage}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel (Selected Conversation) */}
      <div
        style={{
          width: "70%",
          backgroundColor: "#f8f8f8",
          padding: "20px",
          borderRadius: "0 12px 12px 0",
        }}
      >
        {selectedConversation ? (
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#26a69a",
                marginBottom: "16px",
              }}
            >
              {selectedConversation.studentName}
            </h2>
            <div style={{ marginBottom: "16px" }}>
              {/* Display message history */}
              <div
                style={{
                  padding: "16px",
                  marginBottom: "12px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "600" }}>
                    {selectedConversation.studentName}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#9e9e9e",
                    }}
                  >
                    {new Date(selectedConversation.timestamp).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: "14px", color: "#757575" }}>
                  {selectedConversation.lastMessage}
                </p>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <textarea
                placeholder="Write your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d0d0d0",
                  resize: "none",
                  fontSize: "14px",
                }}
                rows="4"
              />
              <button
                onClick={handleSendMessage}
                style={{
                  backgroundColor: "#26a69a",
                  color: "#fff",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2c9c85")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#26a69a")}
              >
                <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "18px" }} />
                Send
              </button>
            </div>
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#757575",
              fontSize: "16px",
            }}
          >
            Select a conversation to view and reply.
          </p>
        )}
      </div>
    </div>
  );
};

export default Messages;
