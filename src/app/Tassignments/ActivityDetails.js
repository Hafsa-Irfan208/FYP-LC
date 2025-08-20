"use client";

import React, { useState, useEffect } from "react";

export default function ActivityDetails({ activity, onClose, refreshData, isTeacher }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(activity.title);
  const [editedDescription, setEditedDescription] = useState("");

  // ✅ Log activity data for debugging
  useEffect(() => {
    console.log("📌 Activity Data:", activity);
    if (activity) {
      setEditedText(activity.title);
      setEditedDescription(activity.description || "⚠️ No description available.");
    }
  }, [activity]);

  // ✅ Save the updated activity and refresh the data
  const saveEdit = async () => {
    try {
      const response = await fetch(`/api/upLoadActivity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activity.id,
          text: editedText,
          description: editedDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to update activity.");

      alert("✅ Activity updated successfully!");
      setIsEditing(false);
      refreshData(); // 🔄 Refresh updated activities
      onClose(); // Close modal
    } catch (error) {
      console.error("❌ Error updating activity:", error);
      alert("Failed to update activity.");
    }
  };

  // ✅ Prevent rendering if activity is null
  if (!activity) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={modalHeaderStyle}>📌 Activity Details</h2>
          <p style={textStyle}>⏳ Loading activity...</p>
          <button onClick={onClose} style={closeButtonStyle}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={modalHeaderStyle}>📌 Activity Details</h2>
        <div style={modalBodyStyle}>
          {isEditing ? (
            <>
              <label style={labelStyle}>Title:</label>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                style={inputStyle}
              />

              <label style={labelStyle}>Description:</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                style={inputStyle}
              />
            </>
          ) : (
            <>
              <p style={textStyle}><strong>Title:</strong> {editedText}</p>
              <p style={textStyle}><strong>Description:</strong> {editedDescription}</p>
            </>
          )}
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

// ✅ Improved Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  maxWidth: "600px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
};

const modalHeaderStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "15px",
  color: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalBodyStyle = {
  padding: "15px",
  textAlign: "left",
};

const labelStyle = {
  fontWeight: "bold",
  display: "block",
  marginBottom: "5px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const textStyle = {
  fontSize: "16px",
  marginBottom: "10px",
};

const modalFooterStyle = {
  marginTop: "20px",
  textAlign: "center",
};

const editButtonStyle = {
  padding: "10px 20px",
  background: "#ffcc00",
  color: "black",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  marginRight: "10px",
  border: "none",
};

const saveButtonStyle = {
  padding: "10px 20px",
  background: "#4CAF50",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  marginRight: "10px",
  border: "none",
};

const closeButtonStyle = {
  padding: "10px 20px",
  background: "#007bff",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  border: "none",
};
