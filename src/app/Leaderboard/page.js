'use client';

import React, { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch leaderboard data from the API
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard'); // Replace with your API route
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="leaderboard-loading">Loading...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">{error}</div>;
  }

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leader Board</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>RollNo</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((record, index) => (
            <tr key={index}>
              <td>{record.rollNo}</td>
              <td>{record.name}</td>
              <td>{record.grade}</td>
              <td>{record.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
