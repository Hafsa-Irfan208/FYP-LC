'use client';

import React, { useState } from 'react';

export default function ViewQuizAssignment() {
  const [selectedCourse, setSelectedCourse] = useState('');

  // Sample quiz data
  const quizData = [
    { id: 1, course: 'CS-4004', title: 'Quiz 1: Network Layers', dueDate: 'Oct 18, 2024 8:00 PM' },
    { id: 2, course: 'CS-4004', title: 'Quiz 2: Firewalls', dueDate: 'Oct 20, 2024 8:00 PM' },
    { id: 3, course: 'CS-4005', title: 'Quiz 1: Trees and Graphs', dueDate: 'Oct 22, 2024 8:00 PM' },
    { id: 4, course: 'CS-4006', title: 'Quiz 1: Basics of Accounting', dueDate: 'Oct 24, 2024 8:00 PM' },
    { id: 5, course: 'CS-4006', title: 'Quiz 2: Financial Statements', dueDate: 'Oct 26, 2024 8:00 PM' },
  ];

  // Filter quizzes based on the selected course
  const filteredQuizzes = quizData.filter((quiz) => quiz.course === selectedCourse);

  const handleCourseSelect = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div className="view-quiz-assignment-container">
      <header className="view-quiz-assignment-header">
        <h2 className="view-quiz-assignment-title">View Quiz Assignments</h2>
        <select
          className="view-quiz-assignment-select"
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
      <section className="view-quiz-assignment-list">
        {selectedCourse === '' ? (
          <p className="no-quiz-message">Please select a course to view quizzes.</p>
        ) : filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="view-quiz-assignment-item">
              <div className="quiz-details">
                <h3>{`Quiz ${quiz.id}`}</h3>
                <p className="quiz-title">{quiz.title}</p>
              </div>
              <div className="quiz-due-date">{`Due ${quiz.dueDate}`}</div>
            </div>
          ))
        ) : (
          <p className="no-quiz-message">No quizzes available for the selected course.</p>
        )}
      </section>
    </div>
  );
}
