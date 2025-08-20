"use client";

import React, { useState } from "react";

export default function MaterialDetails({ material, onClose, isTeacher }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(material.title);
  const [editedDescription, setEditedDescription] = useState(material.description || "");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(material.fileUrl);

  // Handle File Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const saveEdit = async () => {
    try {
      let uploadedFileUrl = fileUrl;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        console.log("FormData:", formData.get("file"));

        const fileResponse = await fetch("/api/uploadMaterial", {
          method: "POST",
          body: formData,
        });

        if (!fileResponse.ok) {
          const errorData = await fileResponse.json();
          console.error("File upload failed:", errorData.message);
          throw new Error(errorData.message || "Failed to upload file");
        }
        const fileData = await fileResponse.json();
        uploadedFileUrl = fileData.fileUrl;
      }

      // Send updated data to backend
      const response = await fetch(`/api/uploadMaterial`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: material.id,
          title: editedTitle,
          description: editedDescription,
          fileUrl: uploadedFileUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Material update failed:", errorData);
        throw new Error("Failed to update material.");
      }

      const updatedMaterial = await response.json();
      setIsEditing(false);
      setEditedTitle(updatedMaterial.title);
      setEditedDescription(updatedMaterial.description);
      setFileUrl(updatedMaterial.fileUrl);
      onClose();
    } catch (error) {
      console.error("Error updating material:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={modalHeaderStyle}>📄 Material Details</h2>
        <div style={modalBodyStyle}>
          {isEditing ? (
            <>
              <label style={labelStyle}>Title:</label>
              <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} style={inputStyle} />

              <label style={labelStyle}>Description:</label>
              <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} style={inputStyle}></textarea>

              <label style={labelStyle}>Upload New File:</label>
              <input type="file" onChange={handleFileChange} style={inputStyle} />

              {fileUrl && !file && (
                <p>📎 <a href={fileUrl} target="_blank" rel="noopener noreferrer">View Current File</a></p>
              )}
            </>
          ) : (
            <>
              <h3 style={titleStyle}>{editedTitle}</h3>
              <p style={textStyle}><strong>Description:</strong> {editedDescription}</p>
              {fileUrl && <p>📎 <a href={fileUrl} target="_blank" rel="noopener noreferrer">View Attached File</a></p>}
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

// Styles with Bordered Inputs
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { background: "white", padding: "30px", borderRadius: "10px", maxWidth: "600px", width: "90%", textAlign: "center", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)" };
const modalHeaderStyle = { fontSize: "24px", fontWeight: "bold", marginBottom: "15px", color: "#333" };
const modalBodyStyle = { padding: "15px", textAlign: "left" };
const labelStyle = { fontWeight: "bold", display: "block", marginBottom: "5px" };
const inputStyle = { width: "100%", padding: "10px", fontSize: "16px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" };
const titleStyle = { fontSize: "20px", fontWeight: "bold", marginBottom: "10px" };
const textStyle = { fontSize: "16px", marginBottom: "10px" };
const modalFooterStyle = { marginTop: "20px", textAlign: "center" };
const editButtonStyle = { padding: "10px 20px", background: "#ffcc00", color: "black", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginRight: "10px" };
const saveButtonStyle = { padding: "10px 20px", background: "#4CAF50", color: "white", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginRight: "10px" };
const closeButtonStyle = { padding: "10px 20px", background: "#007bff", color: "white", borderRadius: "5px", cursor: "pointer", fontSize: "16px" };
