// Tgrades.js
'use client';

import React from 'react';

export default function Grades() {
  // Hardcoded grades data
  const grades = [
    { studentId: '1', studentName: 'John Doe', grade: 'A' },
    { studentId: '2', studentName: 'Jane Smith', grade: 'B+' },
    { studentId: '3', studentName: 'Alex Johnson', grade: 'A-' },
    { studentId: '4', studentName: 'Emily Davis', grade: 'C' },
  ];

  return (
    <section
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px', 
        margin: '0 auto', // Centers the section on the page
        marginTop: '2rem',
      }}
    >
      <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>
        Grades
      </h3>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {grades.length === 0 ? (
          <li
            style={{
              backgroundColor: '#f0f0f0',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              color: '#555',
              textAlign: 'center',
            }}
          >
            No grades available.
          </li>
        ) : (
          grades.map((grade) => (
            <li
              key={grade.studentId}
              style={{
                backgroundColor: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                color: '#555',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#333',
                  }}
                >
                  {grade.studentName}
                </p>
                <p style={{ color: '#777' }}>
                  <strong>Grade:</strong> {grade.grade}
                </p>
              </div>
              <span
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#edf2f7',
                  color: '#3182ce',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}
              >
                {grade.grade}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
