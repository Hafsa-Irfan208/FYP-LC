'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { uploadFileToS3 } from '@/utils/s3';

export default function Tassignments({ courseId }) {
  const [isModalOpen, setModalOpen] = useState(false); // Controls modal visibility
  const [selectedOption, setSelectedOption] = useState(''); // Tracks selected card
  const [announcementText, setAnnouncementText] = useState(''); // Announcement text
  const [file, setFile] = useState(null); // File state
  const [dueDate, setDueDate] = useState(null); // Due date
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const [materialTitle, setMaterialTitle] = useState('');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDescription, setActivityDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  const onSubmitAssignment = async (e) => {
    e.preventDefault();

    if (!courseId || !title || !dueDate || !file) {
      setError('All fields are required except optional ones');
      return;
    }

    try {
      // Upload file to S3
      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = await uploadFileToS3(file, fileName);

      // Prepare assignment data
      const assignmentData = {
        title,
        description,
        dueDate: dueDate.toISOString(),
        classId: parseInt(courseId, 10),
        fileUrl,
      };

      // Send assignment data to the backend
      const res = await fetch('/api/Tassignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });

      if (res.ok) {
        alert('Assignment created successfully');
        closeModal();
      } else {
        const result = await res.json();
        setError(result.message || 'Failed to create assignment');
      }
    } catch (err) {
      setError('An error occurred while creating the assignment');
      console.error(err);
    }
  };

  const onSubmitMaterial = async (e) => {
    e.preventDefault();

    if (!courseId || !materialTitle || !file) {
        setError("All fields are required.");
        return;
    }

    try {
        // ✅ Upload file to S3
        const fileName = `${Date.now()}-${file.name}`;
        const fileUrl = await uploadFileToS3(file, fileName);

        // ✅ Ensure correct data is passed
        const materialsData = {
            title: materialTitle,  // ✅ FIX: Use materialTitle, not title
            classId: parseInt(courseId, 10),
            fileUrl,
        };

        console.log("📤 Sending Data to API:", materialsData);

        // ✅ Send data to backend
        const res = await fetch('/api/uploadMaterial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(materialsData),
        });

        if (!res.ok) {
            const result = await res.json();
            console.error("❌ API Error:", result);
            setError(result.message || 'Failed to upload material.');
            return;
        }

        alert("📂 Material uploaded successfully!");
        closeModal();
    } catch (err) {
        console.error("❌ Error uploading material:", err);
        setError("An unexpected error occurred while uploading the material.");
    }
};



  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
  
    if (!announcementText.trim()) {
      setError('Announcement cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch('/api/annoucements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: announcementText,
          courseId: parseInt(courseId, 10), // Ensure correct type
        }),
      });
  
      // Check if response is not OK
      if (!response.ok) {
        const errorData = await response.text(); // Read error as text (HTML or JSON)
        console.error(`❌ API Error: ${errorData}`);
        setError(errorData || 'Failed to post announcement.');
        return;
      }
  
      // Parse the JSON response
      const result = await response.json();
      alert('📢 Announcement posted successfully!');
      closeModal();
  
    } catch (err) {
      console.error('❌ Error posting announcement:', err);
      setError('An error occurred while posting the announcement.');
    }
  };
  
  
  
  /** ✅ SAME LOGIC FOR ACTIVITIES */
  const handleCreateActivity = async (e) => {
    e.preventDefault();

    if (!courseId || !activityTitle) {
      setError("Activity title is required.");
      return;
    }

    try {
      const activityData = {
        title: activityTitle,
        description: activityDescription,
        classId: parseInt(courseId, 10),
      };

      const res = await fetch("/api/uploadActivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });

      if (res.ok) {
        alert("🎯 Activity created successfully!");
        closeModal();
      } else {
        const result = await res.json();
        setError(result.message || "Failed to create activity.");
      }
    } catch (err) {
      setError("An error occurred while creating the activity.");
      console.error(err);
    }
  };

  

  const openModal = (option) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOption('');
    setFile(null);
    setDueDate(null);
    setAnnouncementText('');
    setMaterialTitle("");
    setActivityTitle("");
    setActivityDescription("");
  
  };

 // ✅ ADDED MATERIALS & ACTIVITIES MODAL LOGIC WITHOUT CHANGING EXISTING STRUCTURE
 const renderModalContent = () => {
  switch (selectedOption) {
    case "Assignment":
      return (
        <>
          <h2 className="create-assignment-modal-title">Create Assignment</h2>
          <form className="create-assignment-modal-form" onSubmit={onSubmitAssignment}>
            <div>
              <label>Title</label>
              <input type="text" className="create-assignment-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label>Instructions (optional)</label>
              <textarea className="create-assignment-input" placeholder="Instructions" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div>
              <label>Attach Task</label>
              <input type="file" className="create-assignment-input" onChange={handleFileChange} required />
              {file && <p>File: {file.name}</p>}
            </div>

            <div>
              <label>Due Date</label>
              <DatePicker selected={dueDate} onChange={handleDateChange} className="create-assignment-input" placeholderText="Select a due date" dateFormat="MMMM d, yyyy" required />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="create-assignment-modal-actions">
              <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="assign-btn">Assign</button>
            </div>
          </form>
        </>
      );

    case "Announcements":
      return (
        <>
          <h2 className="create-assignment-modal-title">Create Announcement</h2>
          <form className="create-assignment-modal-form" onSubmit={handlePostAnnouncement}>
            <div>
              <label>Announcement</label>
              <textarea className="create-assignment-input" placeholder="Write your announcement here..." value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} required />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="create-assignment-modal-actions">
              <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="assign-btn">Post</button>
            </div>
          </form>
        </>
      );

    case "Materials":
      return (
        <>
          <h2 className="create-assignment-modal-title">Upload Material</h2>
          <form className="create-assignment-modal-form" onSubmit={onSubmitMaterial}>
            <div>
              <label>Title</label>
              <input type="text" className="create-assignment-input" placeholder="Title" value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} required />
            </div>

            <div>
              <label>Attach File</label>
              <input type="file" className="create-assignment-input" onChange={handleFileChange} required />
              {file && <p>File: {file.name}</p>}
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="create-assignment-modal-actions">
              <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="assign-btn">Upload</button>
            </div>
          </form>
        </>
      );

    case "Activities":
      return (
        <>
          <h2 className="create-assignment-modal-title">Create Activity</h2>
          <form className="create-assignment-modal-form" onSubmit={handleCreateActivity}>
            <div>
              <label>Activity Title</label>
              <input type="text" className="create-assignment-input" placeholder="Activity Title" value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)} required />
            </div>

            <div>
              <label>Description (optional)</label>
              <textarea className="create-assignment-input" placeholder="Describe the activity..." value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="create-assignment-modal-actions">
              <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="assign-btn">Create</button>
            </div>
          </form>
        </>
      );

    default:
      return null;
  }
};

  return (
    <div className="tassignments-content">
      <div className="tassignments-card-container">
        <div className="tassignments-card">
          <div className="tassignments-card-icon">📂</div>
          <h3 className="tassignments-card-title">Assignment</h3>
          <p className="tassignments-card-description">Create an assignment portal</p>
          <button className="tassignments-create-btn" onClick={() => openModal('Assignment')}>Create +</button>
        </div>

        <div className="tassignments-card">
          <div className="tassignments-card-icon">📢</div>
          <h3 className="tassignments-card-title">Announcements</h3>
          <p className="tassignments-card-description">Create an announcement for your class</p>
          <button className="tassignments-create-btn" onClick={() => openModal('Announcements')}>Create +</button>
        </div>
        {/* Materials */}
        <div className="tassignments-card">
          <div className="tassignments-card-icon">📁</div>
          <h3 className="tassignments-card-title">Materials</h3>
          <p className="tassignments-card-description">Upload materials for students</p>
          <button className="tassignments-create-btn" onClick={() => openModal("Materials")}>Upload +</button>
        </div>

        {/* Activities */}
        <div className="tassignments-card">
          <div className="tassignments-card-icon">🎯</div>
          <h3 className="tassignments-card-title">Activities</h3>
          <p className="tassignments-card-description">Create class activities</p>
          <button className="tassignments-create-btn" onClick={() => openModal("Activities")}>Create +</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="create-assignment-modal-overlay">
          <div className="create-assignment-modal">{renderModalContent()}</div>
        </div>
      )}
    </div>
  );
}
