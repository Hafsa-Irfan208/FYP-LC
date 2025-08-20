'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ViewAssignments() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [course, setCourse] = useState(null);
  const [assignmentsData, setAssignmentsData] = useState([]);

  // Filter assignments based on the selected course
  const filteredAssignments = assignmentsData.filter((assignment) => assignment.course === selectedCourse);
useEffect(() => {
    const fetchCourseAndAssignments = async () => {
      try {
        if (!courseId) {
          setError('Course ID is missing in the URL.');
          setLoading(false);
          return;
        }

        // Fetch course data
        const courseResponse = await fetch(`/api/get-classes?courseId=${courseId}`);
        if (!courseResponse.ok) {
          const errorData = await courseResponse.json();
          setError(errorData.message || 'Failed to fetch course data.');
          setLoading(false);
          return;
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch assignments for the course
        const assignmentsResponse = await fetch(`/api/get-assignments?courseId=${courseId}`);
        if (!assignmentsResponse.ok) {
          const errorData = await assignmentsResponse.json();
          setError(errorData.message || 'Failed to fetch assignments.');
        } else {
          const assignmentsData = await assignmentsResponse.json();
          setAssignments(assignmentsData);
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndAssignments();
  }, [courseId]);

  const handleCourseSelect = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div className="view-assignment-container">
      <header className="view-assignment-header">
        <h2 className="view-assignment-title">View Assignments</h2>
        <select
          className="view-assignment-select"
          value={selectedCourse}
          onChange={handleCourseSelect}
        >
          <option value="" disabled>
            Select course
          </option>
          <option value="CS-4004">CS-4004 Coal</option>
          <option value="CS-4005">CS-4005 Data Structure</option>
          <option value="CS-4006">CS-4006 Accounting</option>
        </select>
      </header>
      <section className="view-assignment-list">
        {selectedCourse === '' ? (
          <p className="no-assignments-message">Please select a course to view assignments.</p>
        ) : filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="view-assignment-item">
              <div className="assignment-details">
                <h3>{`Assignment ${assignment.id}`}</h3>
                <p className="assignment-title">{assignment.title}</p>
              </div>
              <div className="assignment-due-date">{`Due ${assignment.dueDate}`}</div>
            </div>
          ))
        ) : (
          <p className="no-assignments-message">No assignments available for the selected course.</p>
        )}
      </section>
    </div>
  );
}
