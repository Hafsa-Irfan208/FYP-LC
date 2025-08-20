"use client";
import React, { useState, useEffect } from "react";

export default function AssignmentDetails({
  assignment,
  onClose,
  testCases,
  handleFileChange,
  handleSubmitFile,
  submittedFiles,
  uploading,
  output,
  isTeacher,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedTitle, setEditedTitle] = useState(assignment.title);
  const [editedDescription, setEditedDescription] = useState(assignment.description || "");
  const [editedDueDate, setEditedDueDate] = useState(assignment.dueDate ? assignment.dueDate.split("T")[0] : "");
  const [fileUrl, setFileUrl] = useState(assignment.fileUrl);
  const [assignmentTestCases, setAssignmentTestCases] = useState([]);

  // ✅ Ensure test cases are loaded properly
  useEffect(() => {
    if (testCases && testCases[assignment?.id]) {
      setAssignmentTestCases(testCases[assignment.id]);
    } else {
      setAssignmentTestCases([]);
    }
  }, [testCases, assignment]);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={modalHeaderStyle}>📘 Assignment Details</h2>
        <div style={modalBodyStyle}>
          {isEditing ? (
            <>
              <label style={labelStyle}>Title:</label>
              <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} style={inputStyle} />

              <label style={labelStyle}>Instructions:</label>
              <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} style={inputStyle}></textarea>

              <label style={labelStyle}>Due Date:</label>
              <input type="date" value={editedDueDate} onChange={(e) => setEditedDueDate(e.target.value)} style={inputStyle} />

              {fileUrl && (
                <p>📎 <a href={fileUrl} target="_blank" rel="noopener noreferrer">View Attached File</a></p>
              )}
            </>
          ) : (
            <>
              <h3 style={titleStyle}>{editedTitle}</h3>
              <p style={textStyle}><strong>Instructions:</strong> {editedDescription}</p>
              <p style={textStyle}><strong>Due Date:</strong> {editedDueDate}</p>
              {fileUrl && <p>📎 <a href={fileUrl} target="_blank" rel="noopener noreferrer">View Attached File</a></p>}
            </>
          )}
        </div>

        <div style={modalFooterStyle}>
          {isTeacher && (
            isEditing ? (
              <button onClick={() => setIsEditing(false)} style={saveButtonStyle}>💾 Save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} style={editButtonStyle}>✏️ Edit</button>
            )
          )}
          <button onClick={onClose} style={closeButtonStyle}>Close</button>
        </div>

        {/* ✅ Submission UI for Students */}
        {!isTeacher && (
          <>
            <button onClick={() => setIsSubmitting(!isSubmitting)} style={submitButtonStyle}>
              📝 Submit Solution
            </button>

            {isSubmitting && (
              <div style={submissionContainerStyle}>
                <h4 style={submissionTitleStyle}>📤 Submit Your Solutions</h4>

                {/* ✅ Correctly Display Test Cases */}
                {assignmentTestCases.length > 0 ? (
                  assignmentTestCases.map((questionNumber) => (
                    <div key={questionNumber} style={submissionCardStyle}>
                      <h5 style={questionTitleStyle}>Question {questionNumber}</h5>
                      <input type="file" onChange={(e) => handleFileChange(e, assignment.id, questionNumber)} style={fileInputStyle} />
                      <button onClick={() => handleSubmitFile(assignment.id, questionNumber)} style={submitFileButtonStyle}>
                        📤 Upload & Submit
                      </button>

                      {/* ✅ Display Submission Results */}
                      {output?.[assignment.id]?.[questionNumber] && (
                        <div style={resultBoxStyle}>
                          <h5 style={resultTitleStyle}>✅ Submission Result</h5>
                          <pre style={resultTextStyle}>{output[assignment.id][questionNumber]}</pre>
                        </div>
                      )}

                      {/* ✅ Display Submitted File */}
                      {submittedFiles?.[`${assignment.id}-${questionNumber}`] && (
                        <p style={{ marginTop: "0.5rem", color: "#4CAF50", fontWeight: "bold" }}>
                          ✅ <a href={submittedFiles[`${assignment.id}-${questionNumber}`]} target="_blank" rel="noopener noreferrer">
                            View Submitted File
                          </a>
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={noTestCasesStyle}>⚠️ No test cases available for this assignment.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}



// ✅ Styles
const titleStyle = { fontSize: "1.5rem", fontWeight: "bold", color: "#333", marginBottom: "10px", textAlign: "center" };
const textStyle = { fontSize: "1rem", color: "#555", marginBottom: "5px" };
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { background: "white", padding: "30px", borderRadius: "10px", maxWidth: "600px", width: "90%", textAlign: "center" };
const modalHeaderStyle = { fontSize: "24px", fontWeight: "bold", marginBottom: "15px", color: "#333" };
const modalBodyStyle = { padding: "15px", textAlign: "left" };
const modalFooterStyle = { marginTop: "20px", textAlign: "center", display: "flex", justifyContent: "space-between" };
const submitButtonStyle = { backgroundColor: "#f97316", padding: "10px", borderRadius: "5px", cursor: "pointer" };
const submissionContainerStyle = { backgroundColor: "#f9f9f9", padding: "1.5rem", borderRadius: "10px", border: "1px solid #ddd", marginTop: "20px", textAlign: "center" };
const submissionCardStyle = { padding: "1rem", border: "1px solid #ccc", borderRadius: "6px", marginBottom: "1rem", backgroundColor: "#f9f9f9" };
const questionTitleStyle = { fontSize: "1.1rem", fontWeight: "bold", color: "#333" };
const submitFileButtonStyle = { backgroundColor: "#38b2ac", color: "white", padding: "8px", borderRadius: "5px", cursor: "pointer", marginTop: "10px" };
const noTestCasesStyle = { color: "#999", textAlign: "center" };
const closeButtonStyle = { backgroundColor: "#007bff", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", border: "none", fontSize: "14px" };
const submissionTitleStyle = { fontSize: "1.3rem", fontWeight: "bold", color: "#444", marginBottom: "10px", textAlign: "center" };
const resultBoxStyle = { marginTop: "10px", padding: "10px", backgroundColor: "#e9ecef", borderRadius: "6px" };
const resultTitleStyle = { fontWeight: "bold", color: "#333" };
const resultTextStyle = { fontSize: "0.9rem", color: "#444" };
const editButtonStyle = {
  backgroundColor: "#ffcc00",
  color: "#333",
  padding: "10px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  border: "none",
  fontWeight: "bold",
};

const saveButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  border: "none",
  fontWeight: "bold",
};

const fileInputStyle = { 
  display: "block", 
  padding: "0.4rem", 
  marginTop: "0.5rem", 
  border: "1px solid #ddd", 
  borderRadius: "4px", 
  width: "100%" 
};
const labelStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
  color: "#333",
  display: "block",
  marginBottom: "5px",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "1rem",
};
