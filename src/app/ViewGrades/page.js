'use client';

import React, { useState } from 'react';
import DetailedCourseGrades from '../DetailedCourseGrades/page'; // Import DetailedCourseGrades component
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ViewGrades() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDetailedGrades, setShowDetailedGrades] = useState(false); // To toggle between detailed and main view

  const courses = [
    { id: 'CS-4004', name: 'Coal' },
    { id: 'CS-4005', name: 'Data Structure' },
    { id: 'CS-4006', name: 'Accounting' },
    { id: 'CS-1509', name: 'Database' },
    { id: 'CS-1597', name: 'Algorithms' },
  ];

  const data = {
    labels: ['Coal', 'Data Structures', 'Accounting', 'Database Systems'],
    datasets: [
      {
        label: 'Performance',
        data: [75, 45, 90, 60],
        backgroundColor: '#14b8a6',
        barThickness: 80, // Adjusted bar width for aesthetics
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setDropdownOpen(false);
    setShowDetailedGrades(true); // Show detailed grades when a course is selected
  };

  const handleBackToGrades = () => {
    setShowDetailedGrades(false); // Return to the main grades view
  };

  return (
    <div className="view-grades-container">
      {showDetailedGrades ? (
        <DetailedCourseGrades course={selectedCourse} onBack={handleBackToGrades} />
      ) : (
        <>
          <header className="view-grades-header">
            <h2 className="view-grades-title">For Detailed Performance Report</h2>
            <div className="course-dropdown">
              <button
                className="course-dropdown-button"
                onClick={handleDropdownToggle}
              >
                {selectedCourse || 'Select course'}
                <span className="dropdown-icon">📋</span>
              </button>
              {dropdownOpen && (
                <ul className="course-dropdown-menu">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      onClick={() =>
                        handleCourseSelect(`${course.id} ${course.name}`)
                      }
                    >
                      {course.id} {course.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>
          <main className="view-grades-content">
            <div className="performance-chart">
              <Bar data={data} options={options} />
            </div>
            <div className="performance-summary">
              <div className="completed-item">
                <h3>Completed Quizzes</h3>
                <p>10/15</p>
              </div>
              <div className="completed-item">
                <h3>Completed Assignments</h3>
                <p>11/18</p>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
