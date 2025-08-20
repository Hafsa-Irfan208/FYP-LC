'use client';

import React, { useState } from 'react';
import Leaderboard from '../Leaderboard/page'; // Import Leaderboard component

export default function DetailedCourseGrades({ course, onBack }) {
  const [currentView, setCurrentView] = useState('grades'); // State to toggle between views

  const handleFeedbackClick = () => {
    // Logic for feedback button can go here
    console.log('Feedback clicked');
  };

  const handleLeaderboardClick = () => {
    setCurrentView('leaderboard'); // Switch to leaderboard view
  };

  if (currentView === 'leaderboard') {
    return <Leaderboard onBack={() => setCurrentView('grades')} />; // Show leaderboard view
  }

  return (
    <div className="detailed-course-container">
      <header className="detailed-course-header">
        <h2 className="detailed-course-title">{course}</h2>
        <div className="detailed-course-navigation">
          <button onClick={onBack} className="back-to-grades-button">
            Back to Grades
          </button>
          <button onClick={handleFeedbackClick} className="feedback-button">
            Feedback
          </button>
          <button onClick={handleLeaderboardClick} className="leaderboard-button">
            Leaderboard
          </button>
        </div>
      </header>
      <section className="detailed-course-content">
        <h3>Assignments</h3>
        <table className="detailed-course-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Total</th>
              <th>Obtained</th>
              <th>Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>100</td>
              <td>98</td>
              <td>A+</td>
              <td>Very Well Done</td>
            </tr>
            <tr>
              <td>2</td>
              <td>150</td>
              <td>110</td>
              <td>C+</td>
              <td>Keep Improving</td>
            </tr>
          </tbody>
        </table>
        <h3>Quizzes</h3>
        <table className="detailed-course-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Total</th>
              <th>Obtained</th>
              <th>Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>10</td>
              <td>9</td>
              <td>A+</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>2</td>
              <td>20</td>
              <td>15</td>
              <td>B</td>
              <td>Good Work</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
