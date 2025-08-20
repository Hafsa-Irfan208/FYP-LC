'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function EnrollClass({ onClose, onEnroll }) {
  const { data: session } = useSession();
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleEnroll = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classCode, studentId: session.user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      onEnroll(); // Trigger parent component's enroll logic
    } catch (err) {
      setError('You are successfully enrolled in class');
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-class-modal-overlay">
      <div className="enroll-class-modal">
        <h2 className="enroll-class-modal-title">Enroll Class</h2>
        <div className="enroll-class-modal-content">
          <div className="signed-in-info">
            <p>
              <strong>You are currently signed in as:</strong>
            </p>
            <div className="user-email-box">
              <p>{session?.user?.email || 'Unknown'}</p>
            </div>
          </div>
          <div className="class-code">
            <label htmlFor="class-code">Class code</label>
            <input
              type="text"
              id="class-code"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Ask your teacher for the code to enroll"
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="enroll-class-modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="enroll-btn" onClick={handleEnroll} disabled={loading}>
              {loading ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
