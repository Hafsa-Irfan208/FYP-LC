"use client";

import React, { useState } from "react";

export default function AnnouncementDetails({ announcement, onClose, refreshData, isTeacher }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(announcement.text);

  const saveEdit = async () => {
    try {
      const response = await fetch(`/api/annoucements`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: announcement.id, text: editedText }),
      });

      if (!response.ok) {
        throw new Error("Failed to update announcement.");
      }

      const updatedAnnouncement = await response.json();

      // Update UI immediately
      setEditedText(updatedAnnouncement.text);
      setIsEditing(false);

      // ✅ Refresh announcements
      refreshData();

      // ✅ Close modal
      onClose();
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={modalHeaderStyle}>📢 Announcement</h2>
        <div style={modalBodyStyle}>
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              style={textAreaStyle}
            />
          ) : (
            <p style={messageStyle}>{editedText}</p>
          )}
          <p style={dateStyle}>
            <strong>Date:</strong> {new Date(announcement.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div style={modalFooterStyle}>
          {/* ✅ Show Edit button ONLY if isTeacher is true */}
          {isTeacher && (
            isEditing ? (
              <button onClick={saveEdit} style={saveButtonStyle}>💾 Save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} style={editButtonStyle}>✏️ Edit</button>
            )
          )}
          <button onClick={onClose} style={closeButtonStyle}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ✅ STYLES
const overlayStyle = { 
  position: "fixed", 
  top: 0, left: 0, width: "100%", height: "100%", 
  background: "rgba(0, 0, 0, 0.5)", 
  display: "flex", justifyContent: "center", alignItems: "center", 
  zIndex: 1000 
};

const modalStyle = { 
  background: "white", padding: "30px", borderRadius: "10px", 
  maxWidth: "600px", width: "80%", textAlign: "center", 
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)" 
};

const modalHeaderStyle = { fontSize: "24px", fontWeight: "bold", marginBottom: "15px", color: "#333" };

const modalBodyStyle = { padding: "15px", textAlign: "left" };

const messageStyle = { fontSize: "18px", marginBottom: "10px", color: "#444" };

const dateStyle = { fontSize: "16px", color: "#666" };

const modalFooterStyle = { marginTop: "20px", textAlign: "center" };

const editButtonStyle = { padding: "10px 20px", background: "#ffcc00", color: "black", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginRight: "10px" };

const saveButtonStyle = { padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginRight: "10px" };

const closeButtonStyle = { padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" };

const textAreaStyle = { 
  width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", height: "100px"
};
