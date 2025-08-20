"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AssignmentDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`/api/get-assignments?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setAssignment(data);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/api/get-submissions?assignmentId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchAssignment();
    fetchSubmissions();
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmitFile = async () => {
    if (!selectedFile) {
      alert("Please select a file before submitting.");
      return;
    }

    setUploading(true);
    try {
      // Simulating file upload (replace with actual upload logic)
      const fileUrl = URL.createObjectURL(selectedFile);

      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: session?.user?.id,
          assignmentId: id,
          fileUrl,
        }),
      });

      alert("Submission successful!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error during submission process:", error);
      alert("An error occurred.");
    } finally {
      setUploading(false);
    }
  };

  if (!assignment) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>{assignment.title}</h1>
      <p>{assignment.description}</p>
      <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
      {assignment.fileUrl && <p><a href={assignment.fileUrl} target="_blank">View Attached File</a></p>}

      {/* STUDENT SUBMISSION SECTION */}
      {session?.user?.role === "STUDENT" && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid gray", borderRadius: "8px" }}>
          <h2>Your Work</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSubmitFile} style={{ marginLeft: "10px" }}>
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>
      )}

      {/* TEACHER VIEW - SEE STUDENT SUBMISSIONS */}
      {session?.user?.role === "TEACHER" && (
        <div style={{ marginTop: "30px" }}>
          <h2>Student Submissions</h2>
          {submissions.length > 0 ? (
            <ul>
              {submissions.map((submission) => (
                <li key={submission.id}>
                  <a href={submission.fileUrl} target="_blank">View Submission</a>
                  <span> - Submitted by {submission.student.firstName} {submission.student.lastName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No submissions yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
