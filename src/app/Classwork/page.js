'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';

import {uploadFileToS3} from '@/utils/s3';  
export default function Classwork() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
    const [assignmentsWithSubs, setAssignmentsWithSubs] = useState([]); // ✅ new state
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
 
  const { data: session } = useSession();
  useEffect(() => {
  if (courseId) {
    fetchAssignments();
  }
}, [courseId]);

  useEffect(() => {
    if (assignments.length > 0) {
      fetchSubmissions();
    }
  }, [assignments]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/get-assignments?courseId=${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch assignments.");
      const data = await response.json();

      console.log("Fetched Assignments:", data); // ✅ Debugging log
      setAssignments(data.assignments);  // ✅ Set assignments correctly
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

const fetchSubmissions = async () => {
    try {
      const assignmentsWithSubs = await Promise.all(
        assignments.map(async (assignment) => {
          try {
            const submissionRes = await fetch(`/api/get-submissions?assignmentId=${assignment.id}`);
            if (!submissionRes.ok) throw new Error("Failed to fetch submissions.");
            const submissionData = await submissionRes.json();
            console.log(`Fetched Submissions for Assignment ${assignment.id}:`, submissionData); // ✅ Debugging log

            return {
              ...assignment,
              submissions: submissionData || [],
            };
          } catch (err) {
            console.error(`Error fetching submissions for assignment ${assignment.id}:`, err);
            return {
              ...assignment,
              submissions: [],
            };
          }
        })
      );
 setAssignmentsWithSubs(assignmentsWithSubs); // ✅ store in state
      console.log("Assignments with Submissions:", assignmentsWithSubs); // ✅ Debugging log

      const allSubmissions = assignmentsWithSubs.flatMap((assignment) =>
        assignment.submissions.map((submission) => ({
          ...submission,
          assignment: {
            id: assignment.id,
            title: assignment.title,
            dueDate: assignment.dueDate,
          },
        }))
      );
      setSubmissions(allSubmissions); 
      console.log("Fetched Submissions:", allSubmissions); // ✅ Debugging log
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to fetch submissions.");
    }
  };



      
      

  // Helper function to format the date range
  const formatWeek = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start of the week
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week

    const options = { month: 'short', day: 'numeric' };
    return `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString(
      'en-US',
      options
    )}, ${startOfWeek.getFullYear()}`;
  };

  // Handlers to navigate weeks
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="classwork-container">
      <header className="classwork-header">
        <h2 className="classwork-title">To-Do List</h2>
        <div className="date-navigation">
          <button className="prev-week" onClick={handlePreviousWeek}>
            &lt;
          </button>
          <span className="current-week">{formatWeek(currentDate)}</span>
          <button className="next-week" onClick={handleNextWeek}>
            &gt;
          </button>
        </div>
      </header>
      <main className="classwork-content">
    <div className="classwork-section assigned">
  <h3>Assigned</h3>
  <ul>
    {assignments && assignments.length > 0 ? (
      assignments
        .filter((assignment) => new Date(assignment.dueDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
        .map((assignment) => (
          <li key={assignment.id}>
            <div className="task-title">{assignment.title}</div>
            <div className="task-date">
              {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </li>
        ))
    ) : (
      <li>No assigned tasks</li>
    )}
  </ul>
</div>

<div className="classwork-section missing">
          <h3>Missing</h3>
          <ul>
            {assignmentsWithSubs && assignmentsWithSubs.length > 0 ? (
              assignmentsWithSubs
                .filter((assignment) => {
                  const isPastDue =
                    new Date(assignment.dueDate).setHours(0, 0, 0, 0) <
                    new Date().setHours(0, 0, 0, 0);

                  const isSubmitted =
                    assignment.submissions && assignment.submissions.length > 0;

                  return isPastDue && !isSubmitted;
                })
                .map((assignment) => (
                  <li key={assignment.id} style={{ color: 'red' }}>
                    <div className="task-title">{assignment.title}</div>
                    <div className="task-date" style={{ color: 'red' }}>
                      {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </li>
                ))
            ) : (
              <li>No missing tasks</li>
            )}
          </ul>
        </div>




        <div className="classwork-section done">
  <h3>Done</h3>
  <ul>
    {submissions && submissions.length > 0 ? (
      submissions.map((submission) => (
        <li key={submission.id}>  {/* Ensure 'submission.id' is unique */}
          <div className="submission-title"> {submission.assignment.title}</div>
         
          <div className="submission-time">
            Submitted At: {new Date(submission.submittedAt).toLocaleString()}
          </div>
        </li>
      ))
    ) : (
      <li>No completed task</li>
    )}
  </ul>
</div>
      </main>
    </div>
  );
}