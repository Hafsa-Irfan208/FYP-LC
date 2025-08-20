'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import Tassignments from "../Tassignments/page"; // Import Tassignments component for assignments if needed
import AssignmentDetails from "../Tassignments/AssignmentDetails";
import AnnouncementDetails from "../Tassignments/AnnouncementDetails";
import MaterialDetails from "../Tassignments/MaterialDetails"; // NEW COMPONENT
import ActivityDetails from "../Tassignments/ActivityDetails"; // NEW COMPONENT
import Tgrades from "../Tgrades/page"; // Import Tgrades component for grades if needed

export default function TeacherStream() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStudentsCardVisible, setStudentsCardVisible] = useState(false);
  const [currentView, setCurrentView] = useState('stream'); // Default view is stream
  const [enrolledStudents, setEnrolledStudents] = useState([]); // Store enrolled students here
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);  // ✅ NEW STATE
  const [activities, setActivities] = useState([]); // ✅ NEW STATE
  const [testCases, setTestCases] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [numQuestions, setNumQuestions] = useState(1); // Number of questions per assignment
  const [announcements, setAnnouncements] = useState([]); // Store fetched announcements
  const [modalType, setModalType] = useState("");
  const { data: session, status } = useSession();
  const [currentTeacher, setCurrentTeacher] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // Track editing announcement or assignment
  const [editedContent, setEditedContent] = useState(""); // Temporary storage for edited text
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]); // ✅ Store grades data
  const [loadingResults, setLoadingResults] = useState(true);
  const [results, setResults] = useState([])
  const [plagiarismResults, setPlagiarismResults] = useState([]);
  const [selectedPlagiarismMatch, setSelectedPlagiarismMatch] = useState(null);
  const [showReportPanel, setShowReportPanel] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setCurrentTeacher(session.user.name); // Fetch logged-in teacher's name dynamically
    }
  }, [session]);
  useEffect(() => {
    if (courseId) {
      fetchAssignments();
      fetchAnnouncements();
    }
  }, [courseId],assignments,announcements);
  
  useEffect(() => {
    if (courseId) {
      fetchMaterials();
    }
  }, [courseId,materials]); // Fetch only when courseId changes
  
  useEffect(() => {
    if (courseId) {
      fetchActivities();
    }
  }, [courseId, JSON.stringify(activities)]);
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!courseId) {
          setError('Course ID is missing.');
          setLoading(false);
          return;
        }

        // Fetch Course Details
        const courseResponse = await fetch(`/api/get-classes?courseId=${courseId}`);
        if (!courseResponse.ok) throw new Error('Failed to fetch course.');
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // ✅ Set Current Teacher Name (From API Instead of Session)
      if (courseData.teacherName) {
        setCurrentTeacher(courseData.teacherName);
      }

        // Fetch Assignments
      await fetchAssignments(); // ✅ Fetch Assignments Separately

        // Fetch Announcements
        const announcementsResponse = await fetch(`/api/get-announcements?courseId=${courseId}`); // Use courseId instead of classId
        if (!announcementsResponse.ok) throw new Error('Failed to fetch announcements.');
        const announcementsData = await announcementsResponse.json();
        setAnnouncements(announcementsData);

        // ✅ Fetch Materials (NEW)
        const materialsResponse = await fetch(`/api/get-materials?courseId=${courseId}`);
        if (!materialsResponse.ok) throw new Error('Failed to fetch materials.');
        const materialsData = await materialsResponse.json();
        setMaterials(materialsData);  

        // ✅ Fetch Activities (NEW)
        const activitiesResponse = await fetch(`/api/get-activities?courseId=${courseId}`);
        if (!activitiesResponse.ok) throw new Error('Failed to fetch activities.');
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);

        // Fetch Enrolled Students
        const studentsResponse = await fetch(`/api/get-enrolled-students?courseId=${courseId}`);
        if (!studentsResponse.ok) throw new Error('Failed to fetch enrolled students.');
        const studentsData = await studentsResponse.json();
        console.log("Fetched Enrolled Students:", studentsData); // Debugging Log
        setEnrolledStudents(studentsData || []);
        

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);
// State to track section visibility
const [isAnnouncementsOpen, setAnnouncementsOpen] = useState(true);
const [isAssignmentsOpen, setAssignmentsOpen] = useState(true);
const [isMaterialsOpen, setMaterialsOpen] = useState(true);  // ✅ NEW
const [isActivitiesOpen, setActivitiesOpen] = useState(true); // ✅ NEW

  
 // Open Modal for Editing
 const openModal = (item, type) => {
  setSelectedItem(item);
  setModalType(type);
};

// Close Modal and Refresh Data
const closeModal = () => {
  setSelectedItem(null);
  setModalType("");
 
};
const openPlagiarismPanel = (match) => {
  setSelectedPlagiarismMatch(match);
};


  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/get-assignments?courseId=${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch assignments.");
      const data = await response.json();
  
      console.log("✅ Fetched Assignments:", data); // Debugging log
      setAssignments(data.assignments || []); // Ensure we handle empty assignments
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };
  
  const checkPlagiarism = async () => {
    try {
      if (!submissions.length) {
        alert("No submissions to check plagiarism.");
        return;
      }
  
      // Extract just the source codes
      const code_list = submissions.map(sub => sub.sourcecode || "");
  
      const response = await fetch("/api/plagiarismCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code_list }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Plagiarism Results:", data.results);
        // Show results in alert (or later in a styled modal)
        alert(
          data.results
            .map(r => `🔁 ${r.file1} vs ${r.file2}: ${r.score}%`)
            .join("\n") || "No plagiarism detected."
        );
      } else {
        alert("Error checking plagiarism: " + data.error);
      }
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      alert("Internal error. Try again.");
    }
  };
  


// ✅ Fetch Submissions Function (Modified to include plagiarism)
const fetchSubmissions = async (assignmentId) => {
  if (!assignmentId) {
    alert("Please select an assignment first!");
    return;
  }

  try {
    const response = await fetch(`/api/get-submissions?assignmentId=${assignmentId}`);
    if (!response.ok) throw new Error("Failed to fetch submissions");

    const data = await response.json();
    setSubmissions(data);
    setSelectedAssignment(assignmentId);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    alert("Error fetching submissions.");
  }
};

  


  
  
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/get-announcements?courseId=${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch announcements.");
      
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
  const fetchMaterials = async () => {
    try {
      console.log(`📡 Fetching materials for courseId: ${courseId}`);
    
      const response = await fetch(`/api/get-materials?courseId=${courseId}`);
    
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch materials: ${errorText}`);
      }
    
      const data = await response.json();
      console.log("✅ Received materials:", data);
  
      // ✅ Ensure `data.materials` exists before updating state
      if (data.materials) {
        setMaterials(data.materials);
      } else {
        setMaterials([]); // Default to empty array if no materials exist
      }
    } catch (error) {
      console.error("❌ Error fetching materials:", error.message);
      setError("Failed to fetch materials.");
    }
  };
  
  
  
  const fetchActivities = async () => {
    try {
      console.log(`📡 Fetching activities for courseId: ${courseId}`);
  
      const response = await fetch(`/api/get-activities?courseId=${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch activities.");
  
      const data = await response.json();
      console.log("✅ Received activities:", data);
  
      // ✅ Ensure the correct data format
      if (Array.isArray(data.activities)) {
        setActivities(data.activities);
      } else {
        console.warn("⚠️ Unexpected data format for activities:", data);
        setActivities([]); // Default to an empty array
      }
    } catch (error) {
      console.error("❌ Error fetching activities:", error.message);
      setError("Failed to fetch activities.");
    }
  };
  
  
  
  

const handleCreateAssignment = async (newAssignmentData) => {
  try {
    const response = await fetch("/api/Tassignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAssignmentData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    alert("Assignment created successfully!");
fetchAssignments();
    // 🔄 Dynamically add the new assignment to the existing list
    setAssignments((prevAssignments) => [result.assignment, ...prevAssignments]); // ✅ Prepend new assignment

  } catch (error) {
    console.error("Error creating assignment:", error);
  }
};
const handleCreateMaterial = async (newMaterialData) => {
  try {
    const response = await fetch("/api/uploadMaterial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMaterialData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    alert("📂 Material uploaded successfully!");
    fetchMaterials();
    setMaterials((prevMaterials) => [result, ...prevMaterials]); // Prepend new material

  } catch (error) {
    console.error("❌ Error uploading material:", error.message);
    alert("Failed to upload material.");
  }
};

const handleCreateActivity = async (newActivityData) => {
  try {
    const response = await fetch("/api/uploadActivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newActivityData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    alert("🎯 Activity created successfully!");

    // ✅ Fetch latest activities instead of relying on local state
    fetchActivities();

  } catch (error) {
    console.error("❌ Error creating activity:", error.message);
    alert("Failed to create activity.");
  }
};



  const startEditing = (item) => {
  setEditingItem(item);
  setEditedContent(item.text || item.title); // Set initial text
};

const saveEditedAnnouncement = async (announcementId) => {
  try {
    const response = await fetch(`/api/annoucements/${announcementId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedContent }),
    });

    if (response.ok) {
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === announcementId
            ? { ...announcement, text: editedContent }
            : announcement
        )
      );
      setEditingItem(null);
    } else {
      alert("Failed to update announcement.");
    }
  } catch (error) {
    console.error("Error updating announcement:", error);
  }
};
const saveEditedMaterial = async (materialId) => {
  try {
    const response = await fetch(`/api/uploadMaterial`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: materialId,
        title: editedContent,  // ✅ Updating material title
      }),
    });

    if (response.ok) {
      setMaterials((prev) =>
        prev.map((material) =>
          material.id === materialId
            ? { ...material, title: editedContent }
            : material
        )
      );
      setEditingItem(null);
      alert("📂 Material updated successfully!");
    } else {
      alert("Failed to update material.");
    }
  } catch (error) {
    console.error("❌ Error updating material:", error);
  }
};

const saveEditedActivity = async (activityId) => {
  try {
    const response = await fetch(`/api/uploadActivity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: activityId,
        title: editedContent,  // ✅ Updating activity title
      }),
    });

    if (response.ok) {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId
            ? { ...activity, title: editedContent }
            : activity
        )
      );
      setEditingItem(null);
      alert("🎯 Activity updated successfully!");
    } else {
      alert("Failed to update activity.");
    }
  } catch (error) {
    console.error("❌ Error updating activity:", error);
  }
};
const saveEditedAssignment = async (assignmentId) => {
  try {
    // Refresh the assignments list to get the latest data
    await fetchAssignments();
    
    // Close the modal after successful update
    setSelectedItem(null);
    setModalType("");
  } catch (error) {
    console.error("Error updating assignment:", error);
    alert("Failed to update assignment. Please try again.");
  }
};

const handleTestCaseChange = (assignmentId, questionNumber, field, value, index) => {
  setTestCases((prev) => {
    const updated = { ...prev };

    if (!updated[assignmentId]) {
      updated[assignmentId] = {};
    }
    
    if (!updated[assignmentId][questionNumber]) {
      updated[assignmentId][questionNumber] = [];
    }
    
    if (!updated[assignmentId][questionNumber][index]) {
      updated[assignmentId][questionNumber][index] = { input: "", expectedOutput: "" };
    }

    // ✅ Correctly updating the specific field
    updated[assignmentId][questionNumber][index] = {
      ...updated[assignmentId][questionNumber][index],
      [field]: value
    };

    return { ...updated }; // ✅ Ensure a new object is returned to trigger re-render
  });
};



const saveTestCases = async (assignmentId) => {
  if (!testCases[assignmentId]) {
    alert("No test cases found.");
    return;
  }

  // ✅ Flatten test cases into an array
  const formattedTestCases = Object.entries(testCases[assignmentId]).flatMap(([questionNumber, cases]) =>
    cases.map((testCase) => ({
      assignmentId: Number(assignmentId), // Ensure it's a number
      questionNumber: Number(questionNumber), // Ensure it's a number
      input: testCase.input || "", // ✅ Match the backend field name
      expectedOutput: testCase.expectedOutput || "", // ✅ Match the backend field name
    }))
  );

  console.log("📌 Sending test cases:", formattedTestCases);

  try {
    const response = await fetch("/api/testcases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignmentId: Number(assignmentId),
        testCases: formattedTestCases, // ✅ Corrected structure
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Test cases saved successfully!");
    } else {
      alert("❌ Error saving test cases: " + result.error);
    }
  } catch (error) {
    console.error("❌ Error saving test cases:", error);
    alert("Error saving test cases.");
  }
};



// ✅ Evaluate Student Submissions and Update Status in UI
const evaluateSubmissions = async (assignmentId) => {
  if (!assignmentId) {
    alert("Please select an assignment first!");
    return;
  }

  try {
    const requestBody = { assignmentId: Number(assignmentId) };

    console.log("📌 Sending request:", requestBody);

    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("📌 Raw response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("❌ JSON Parsing Error:", responseText);
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      console.error("❌ Backend Error:", data);
      throw new Error(data.error || "Failed to evaluate submissions");
    }

    console.log("✅ Evaluation Completed:", data);

       // ✅ Re-fetch submissions from DB to reflect updated 'checked' status
       await fetchSubmissions(assignmentId);

    alert("✅ All student submissions have been evaluated!");

  } catch (error) {
    console.error("❌ Error evaluating submissions:", error);
    alert(error.message);
  }
};

useEffect(() => {
  if (!selectedAssignment) return; // ✅ Prevent unnecessary calls

  const fetchGrades = async () => {
    setLoadingResults(true);

    try {
      const response = await fetch(`/api/get-grades?assignmentId=${selectedAssignment}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data); // ✅ Store only relevant grades
      } else {
        console.error("❌ Error fetching grades:", data.error);
        setResults([]);
      }
    } catch (error) {
      console.error("❌ Network error fetching grades:", error);
      setResults([]);
    }

    setLoadingResults(false);
  };

  fetchGrades();
}, [selectedAssignment]); // ✅ Runs when assignment changes

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: '#555' }}>Loading course details...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>;
  }

  if (!course) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: '#555' }}>No course found.</p>;
  }

  // Helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "#38b2ac"; // Teal color for high scores
    if (score >= 60) return "#4fd1c5"; // Lighter teal for good scores
    if (score >= 40) return "#f59e0b"; // Amber for average scores
    return "#ef4444"; // Red for low scores
  };

  // Helper function to get color based on grade
  const getGradeColor = (grade) => {
    if (grade === 'A') return "#38b2ac"; // Teal color for A
    if (grade === 'B') return "#4fd1c5"; // Lighter teal for B
    if (grade === 'C') return "#f59e0b"; // Amber for C
    if (grade === 'D') return "#f97316"; // Orange for D
    return "#ef4444"; // Red for F
  };

  // Helper function for plagiarism similarity color
  const getSimilarityColor = (score, alpha = 1) => {
    if (score > 80) return `rgba(239, 68, 68, ${alpha})`; // Red for high similarity
    if (score > 50) return `rgba(245, 158, 11, ${alpha})`; // Amber for medium similarity
    return `rgba(56, 178, 172, ${alpha})`; // Teal for low similarity
  };

  return (
    <div className="teacher-stream-container" style={{ 
      fontFamily: 'Inter, system-ui, sans-serif', 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      padding: '2rem',
      color: '#334155'
    }}>
      {/* Enhanced Header Section */}
      <header
        style={{
          background: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
          color: 'white',
          padding: '3rem 3rem',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '2.5rem',
          boxShadow: '0 15px 30px -5px rgba(56, 178, 172, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(56, 178, 172, 0.3) 0%, rgba(49, 151, 149, 0) 60%), radial-gradient(circle at 80% 50%, rgba(56, 178, 172, 0.2) 0%, transparent 60%)',
          zIndex: 0
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '2.75rem', 
            fontWeight: '800',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>{course.name || 'Course Name'}</h1>
          <p style={{ 
            fontSize: '1.25rem', 
            marginTop: '0.5rem',
            opacity: '0.9' 
          }}>{course.classCode || 'Class Code'}</p>
        </div>
      </header>

      {/* Enhanced Navigation Buttons */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '3rem',
          padding: '0.75rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.03)',
        }}
      >
        {[
          { name: 'Stream', view: 'stream', icon: '📰' },
          { name: 'Assignments', view: 'assignments', icon: '📝' },
          { name: 'People', view: 'people', icon: '👥' },
          { name: 'Testcases', view: 'testcases', icon: '🧪' },
          { name: 'Submissions', view: 'Submissions', icon: '📥' },
          { name: 'Grades', view: 'grades', icon: '📊' }
        ].map(({ name, view, icon }) => (
        <button
            key={view}
          style={{
              padding: '1rem 1.5rem',
              backgroundColor: currentView === view ? '#38b2ac' : 'transparent',
              color: currentView === view ? 'white' : '#64748b',
            border: 'none',
              borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
              fontWeight: currentView === view ? '600' : '500',
              boxShadow: currentView === view ? '0 6px 12px -1px rgba(56, 178, 172, 0.25)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={() => setCurrentView(view)}
          >
            <span>{icon}</span>
            {name}
        </button>
        ))}
      </nav>

      {/* Main Content */}
      <main>
        {currentView === 'stream' && (
          <section
            style={{
              backgroundColor: 'white',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
              position: 'relative',
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '1.5rem', 
              color: '#1e293b',
              borderBottom: '2px solid #f1f5f9',
              paddingBottom: '0.75rem'
            }}>
              Class Details
            </h3>
            <p style={{
              padding: '0.75rem 1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              borderLeft: '4px solid #115e59'
            }}>
              <strong>Class Code:</strong> {course.classCode || 'N/A'}
            </p>
            
           {/* Enhanced Announcements Section */}
           <section style={{ 
             backgroundColor: 'white',
             borderRadius: '10px',
             marginTop: '2rem',
             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
             border: '1px solid #e2e8f0'
           }}>
             <div 
               style={{ 
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 padding: '1rem 1.5rem',
                 borderBottom: isAnnouncementsOpen ? '1px solid #e2e8f0' : 'none',
                 cursor: "pointer",
                 borderRadius: '10px 10px 0 0',
                 background: 'linear-gradient(to right, #f8fafc, white)'
               }} 
               onClick={() => setAnnouncementsOpen(!isAnnouncementsOpen)}
             >
               <span style={{ 
                 fontSize: '1.5rem',
                 color: '#38b2ac'
               }}>📢</span>
               <h3 style={{ 
                 fontSize: '1.25rem',
                 fontWeight: '600',
                 color: '#1e293b',
                 margin: 0,
                 flex: 1
               }}>Announcements</h3>
               <button style={{ 
                 background: 'none',
                 border: 'none',
                 fontSize: '1.25rem',
                 color: '#94a3b8',
                 cursor: 'pointer'
               }}>{isAnnouncementsOpen ? "▼" : "▶"}</button>
             </div>

             {isAnnouncementsOpen && (
               <div style={{ padding: '1rem 1.5rem' }}>
                 {announcements.length > 0 ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {announcements.map((announcement) => (
                       <div 
                         key={announcement.id} 
                         style={{
                           backgroundColor: '#f8fafc',
                           padding: '1.5rem',
                           borderRadius: '12px',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease',
                           border: '1px solid #e2e8f0',
                           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02)',
                         }} 
                         onClick={() => openModal(announcement, "announcement")}
                       >
                         <div style={{ 
                           display: 'flex',
                           alignItems: 'flex-start',
                           gap: '1rem'
                         }}>
                           <div style={{ 
                             width: '45px',
                             height: '45px',
                             backgroundColor: '#115e59',
                             color: 'white',
                             borderRadius: '50%',
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             fontWeight: '600',
                             fontSize: '1.1rem',
                             flexShrink: 0,
                             boxShadow: '0 4px 8px rgba(17, 94, 89, 0.15)'
                           }}>
                             {currentTeacher.charAt(0)}
                           </div>
                           <div>
                             <p style={{ 
                               fontSize: '1rem',
                               fontWeight: '600',
                               color: '#1e293b',
                               marginBottom: '0.25rem'
                             }}>
                               {currentTeacher} posted a new announcement
                             </p>
                             <p style={{ 
                               fontSize: '0.875rem',
                               color: '#64748b',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '0.25rem'
                             }}>
                               <span style={{ fontSize: '0.75rem' }}>🕒</span>
                               {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                               })}
                             </p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p style={{ 
                     textAlign: 'center', 
                     color: '#94a3b8',
                     padding: '1.5rem 0',
                     fontSize: '0.95rem'
                   }}>No announcements available.</p>
                 )}
               </div>
             )}
           </section>

           {/* Enhanced Assignments Section */}
           <section style={{ 
             backgroundColor: 'white',
             borderRadius: '10px',
             marginTop: '1.5rem',
             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
             border: '1px solid #e2e8f0'
           }}>
             <div 
               style={{ 
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 padding: '1rem 1.5rem',
                 borderBottom: isAssignmentsOpen ? '1px solid #e2e8f0' : 'none',
                 cursor: "pointer",
                 borderRadius: '10px 10px 0 0',
                 background: 'linear-gradient(to right, #f8fafc, white)'
               }} 
               onClick={() => setAssignmentsOpen(!isAssignmentsOpen)}
             >
               <span style={{ 
                 fontSize: '1.5rem',
                 color: '#38b2ac'
               }}>📝</span>
               <h3 style={{ 
                 fontSize: '1.25rem',
                 fontWeight: '600',
                 color: '#1e293b',
                 margin: 0,
                 flex: 1
               }}>Assignments</h3>
               <button style={{ 
                 background: 'none',
                 border: 'none',
                 fontSize: '1.25rem',
                 color: '#94a3b8',
                 cursor: 'pointer'
               }}>{isAssignmentsOpen ? "▼" : "▶"}</button>
             </div>

             {isAssignmentsOpen && (
               <div style={{ padding: '1rem 1.5rem' }}>
                 {assignments.length > 0 ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {assignments.map((assignment) => (
                       <div 
                         key={assignment.id} 
                         style={{
                           backgroundColor: '#f8fafc',
                           padding: '1.5rem',
                           borderRadius: '12px',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease',
                           border: '1px solid #e2e8f0',
                           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02)',
                         }}
                       >
                         <div style={{ 
                           display: 'flex',
                           alignItems: 'flex-start',
                           gap: '1rem'
                         }} onClick={() => openModal(assignment, "assignment")}>
                           <div style={{ 
                             width: '45px',
                             height: '45px',
                             backgroundColor: '#115e59',
                             color: 'white',
                             borderRadius: '50%',
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             fontWeight: '600',
                             fontSize: '1.1rem',
                             flexShrink: 0,
                             boxShadow: '0 4px 8px rgba(17, 94, 89, 0.15)'
                           }}>
                             {currentTeacher.charAt(0)}
                           </div>
                           <div style={{ flex: 1 }}>
                             <p style={{ 
                               fontSize: '1rem',
                               fontWeight: '600',
                               color: '#1e293b',
                               marginBottom: '0.25rem'
                             }}>
                               {currentTeacher} has created a new assignment: <span style={{ color: '#115e59' }}>{assignment.title}</span>
                             </p>
                             
                           </div>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setSelectedAssignment(assignment.id);
                             }}
                             style={{ 
                               padding: '0.6rem 1.25rem', 
                               backgroundColor: '#115e59', 
                               color: 'white', 
                               borderRadius: '6px', 
                               cursor: 'pointer',
                               border: 'none',
                               fontWeight: '500',
                               display: 'inline-flex',
                               alignItems: 'center',
                               gap: '0.3rem',
                               boxShadow: '0 2px 8px rgba(17, 94, 89, 0.2)',
                               transition: 'all 0.2s ease'
                             }}
                           >
                             <span>➕</span> Add Test Cases
                           </button>  
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p style={{ 
                     textAlign: 'center', 
                     color: '#94a3b8',
                     padding: '1.5rem 0',
                     fontSize: '0.95rem'
                   }}>No assignments available.</p>
                 )}
               </div>
             )}
           </section>

           {/* Enhanced Materials Section */}
           <section style={{ 
             backgroundColor: 'white',
             borderRadius: '10px',
             marginTop: '1.5rem',
             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
             border: '1px solid #e2e8f0'
           }}>
             <div 
               style={{ 
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 padding: '1rem 1.5rem',
                 borderBottom: isMaterialsOpen ? '1px solid #e2e8f0' : 'none',
                 cursor: "pointer",
                 borderRadius: '10px 10px 0 0',
                 background: 'linear-gradient(to right, #f8fafc, white)'
               }} 
               onClick={() => setMaterialsOpen(!isMaterialsOpen)}
             >
               <span style={{ 
                 fontSize: '1.5rem',
                 color: '#38b2ac'
               }}>📂</span>
               <h3 style={{ 
                 fontSize: '1.25rem',
                 fontWeight: '600',
                 color: '#1e293b',
                 margin: 0,
                 flex: 1
               }}>Materials</h3>
               <button style={{ 
                 background: 'none',
                 border: 'none',
                 fontSize: '1.25rem',
                 color: '#94a3b8',
                 cursor: 'pointer'
               }}>{isMaterialsOpen ? "▼" : "▶"}</button>
             </div>

             {isMaterialsOpen && (
               <div style={{ padding: '1rem 1.5rem' }}>
                 {materials.length > 0 ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {materials.map((material) => (
                       <div 
                         key={material.id} 
                         style={{
                           backgroundColor: '#f8fafc',
                           padding: '1.5rem',
                           borderRadius: '12px',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease',
                           border: '1px solid #e2e8f0',
                           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02)',
                         }} 
                         onClick={() => openModal(material, "material")}
                       >
                         <div style={{ 
                           display: 'flex',
                           alignItems: 'flex-start',
                           gap: '1rem'
                         }}>
                           <div style={{ 
                             width: '45px',
                             height: '45px',
                             backgroundColor: '#115e59',
                             color: 'white',
                             borderRadius: '50%',
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             fontWeight: '600',
                             fontSize: '1.1rem',
                             flexShrink: 0,
                             boxShadow: '0 4px 8px rgba(17, 94, 89, 0.15)'
                           }}>
                             {currentTeacher.charAt(0)}
                           </div>
                           <div>
                             <p style={{ 
                               fontSize: '1rem',
                               fontWeight: '600',
                               color: '#1e293b',
                               marginBottom: '0.25rem'
                             }}>
                               {currentTeacher} uploaded a new material: <span style={{ color: '#115e59' }}>{material.title}</span>
                             </p>
                             <p style={{ 
                               fontSize: '0.875rem',
                               color: '#64748b',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '0.25rem'
                             }}>
                               <span style={{ fontSize: '0.75rem' }}>📅</span>
                               {new Date(material.createdAt).toLocaleDateString(undefined, {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                               })}
                             </p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p style={{ 
                     textAlign: 'center', 
                     color: '#94a3b8',
                     padding: '1.5rem 0',
                     fontSize: '0.95rem'
                   }}>No materials available.</p>
                 )}
               </div>
             )}
           </section>

           {/* Enhanced Activities Section */}
           <section style={{ 
             backgroundColor: 'white',
             borderRadius: '10px',
             marginTop: '1.5rem',
             marginBottom: '1rem',
             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
             border: '1px solid #e2e8f0'
           }}>
             <div 
               style={{ 
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 padding: '1rem 1.5rem',
                 borderBottom: isActivitiesOpen ? '1px solid #e2e8f0' : 'none',
                 cursor: "pointer",
                 borderRadius: '10px 10px 0 0',
                 background: 'linear-gradient(to right, #f8fafc, white)'
               }} 
               onClick={() => setActivitiesOpen(!isActivitiesOpen)}
             >
               <span style={{ 
                 fontSize: '1.5rem',
                 color: '#38b2ac'
               }}>🎯</span>
               <h3 style={{ 
                 fontSize: '1.25rem',
                 fontWeight: '600',
                 color: '#1e293b',
                 margin: 0,
                 flex: 1
               }}>Activities</h3>
               <button style={{ 
                 background: 'none',
                 border: 'none',
                 fontSize: '1.25rem',
                 color: '#94a3b8',
                 cursor: 'pointer'
               }}>{isActivitiesOpen ? "▼" : "▶"}</button>
             </div>

             {isActivitiesOpen && (
               <div style={{ padding: '1rem 1.5rem' }}>
                 {activities.length > 0 ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {activities.map((activity) => (
                       <div 
                         key={activity.id} 
                         style={{
                           backgroundColor: '#f8fafc',
                           padding: '1.5rem',
                           borderRadius: '12px',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease',
                           border: '1px solid #e2e8f0',
                           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02)',
                         }} 
                         onClick={() => openModal(activity, "activity")}
                       >
                         <div style={{ 
                           display: 'flex',
                           alignItems: 'flex-start',
                           gap: '1rem'
                         }}>
                           <div style={{ 
                             width: '45px',
                             height: '45px',
                             backgroundColor: '#115e59',
                             color: 'white',
                             borderRadius: '50%',
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             fontWeight: '600',
                             fontSize: '1.1rem',
                             flexShrink: 0,
                             boxShadow: '0 4px 8px rgba(17, 94, 89, 0.15)'
                           }}>
                             {currentTeacher.charAt(0)}
                           </div>
                           <div>
                             <p style={{ 
                               fontSize: '1rem',
                               fontWeight: '600',
                               color: '#1e293b',
                               marginBottom: '0.25rem'
                             }}>
                               {currentTeacher} posted a new activity: <span style={{ color: '#115e59' }}>{activity.title}</span>
                             </p>
                             <p style={{ 
                               fontSize: '0.875rem',
                               color: '#64748b',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '0.25rem'
                             }}>
                               <span style={{ fontSize: '0.75rem' }}>📅</span>
                               {new Date(activity.createdAt).toLocaleDateString(undefined, {
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                               })}
                             </p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p style={{ 
                     textAlign: 'center', 
                     color: '#94a3b8',
                     padding: '1.5rem 0',
                     fontSize: '0.95rem'
                   }}>No activities available.</p>
                 )}
               </div>
             )}
           </section>
          </section>    
        )}

        {currentView === 'assignments' && (
          <Tassignments courseId={courseId} />
        )}
       
       
       {currentView === 'testcases' && selectedAssignment && (
        <section 
        style={{ 
          backgroundColor: 'white', 
          padding: '2.5rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
          backgroundImage: 'linear-gradient(to bottom right, rgba(56, 178, 172, 0.03), transparent)'
          }}>
           <div style={{
             display: "flex",
             alignItems: "center",
             marginBottom: "1.75rem",
             borderBottom: "2px solid #f1f5f9",
             paddingBottom: "0.75rem"
           }}>
             <h3 style={{ 
               fontSize: "1.5rem", 
               fontWeight: "700", 
               color: "#1e293b",
               margin: 0,
               display: "flex",
               alignItems: "center",
               gap: "0.5rem"
             }}>
               <span style={{ fontSize: "1.5rem" }}>🧪</span>
               Test Cases Configuration
             </h3>
           </div>

           <div style={{ 
             background: "linear-gradient(to right, rgba(56, 178, 172, 0.08), rgba(56, 178, 172, 0.02))", 
             borderRadius: "12px", 
             padding: "1.75rem",
             marginBottom: "1.5rem",
             border: "1px solid rgba(56, 178, 172, 0.1)",
             position: "relative",
             overflow: "hidden"
           }}>
             <div style={{
               position: "absolute",
               top: 0,
               right: 0,
               width: "100px",
               height: "100px",
               background: "radial-gradient(circle at top right, rgba(22, 101, 52, 0.2), transparent 70%)",
               zIndex: 0
             }}></div>
             <div style={{ position: "relative", zIndex: 1 }}>
               <div style={{ marginBottom: '1.5rem' }}>
                 <label style={{ 
                   display: "block",
                   fontSize: "1rem",
                   fontWeight: "600",
                   color: "#115e59",
                   marginBottom: "0.75rem"
                 }}>Number of Questions:</label>
                 <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                   <input
                     type="number"
                     min="1"
                     value={numQuestions}
                     onChange={(e) => setNumQuestions(Number(e.target.value))}
                     style={{ 
                       padding: '0.75rem 1rem', 
                       borderRadius: '8px', 
                       border: '1px solid #14b8a6',
                       width: '5rem',
                       fontSize: '1rem',
                       boxShadow: 'inset 0 1px 2px rgba(20, 184, 166, 0.1)'
                     }}
                   />
                   <div style={{ 
                     display: "flex",
                     gap: "0.5rem"
                   }}>
                     <button 
                       onClick={() => numQuestions > 1 && setNumQuestions(numQuestions - 1)}
                       disabled={numQuestions <= 1}
                       style={{
                         width: "2.5rem",
                         height: "2.5rem",
                         borderRadius: "8px",
                         border: "1px solid #14b8a6",
                         background: numQuestions > 1 ? "white" : "#f1f5f9",
                         cursor: numQuestions > 1 ? "pointer" : "not-allowed",
                         fontSize: "1.25rem",
                         display: "flex",
                         alignItems: "center",
                         justifyContent: "center",
                         color: numQuestions > 1 ? "#115e59" : "#94a3b8"
                       }}
                     >−</button>
                     <button 
                       onClick={() => setNumQuestions(numQuestions + 1)}
                       style={{
                         width: "2.5rem",
                         height: "2.5rem",
                         borderRadius: "8px",
                         border: "1px solid #14b8a6",
                         background: "white",
                         cursor: "pointer",
                         fontSize: "1.25rem",
                         display: "flex",
                         alignItems: "center",
                         justifyContent: "center",
                         color: "#115e59"
                       }}
                     >+</button>
                   </div>
                 </div>
               </div>

               <p style={{ 
                 padding: "0.75rem 1rem",
                 borderRadius: "8px",
                 background: "rgba(56, 178, 172, 0.1)",
                 border: "1px solid rgba(56, 178, 172, 0.1)",
                 color: "#115e59",
                 fontWeight: "500",
                 fontSize: "0.95rem",
                 marginBottom: "0.75rem",
                 display: "flex",
                 alignItems: "center",
                 gap: "0.5rem"
               }}>
                 <span style={{ fontSize: "1rem" }}>💡</span>
                 Configure test cases for each question to automatically evaluate student submissions.
               </p>
             </div>
           </div>

{[...Array(numQuestions)].map((_, questionIndex) => {
  const questionNumber = questionIndex + 1; // Ensure questions start from 1

  if (!testCases[selectedAssignment]) {
    testCases[selectedAssignment] = [];
  }

  if (!testCases[selectedAssignment][questionNumber]) {
    testCases[selectedAssignment][questionNumber] = [];
  }

  return (
    <div key={questionNumber} style={{ 
      marginBottom: "2.5rem", 
      padding: "2rem", 
      borderRadius: "16px", 
      border: "1px solid #ccfbf1",
      background: "white",
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.03)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle at top right, rgba(56, 178, 172, 0.07), transparent 70%)",
        zIndex: 0
      }}></div>
      <div style={{
        position: "absolute",
        bottom: -20,
        left: -20,
        width: "150px",
        height: "150px",
        background: "radial-gradient(circle at bottom left, rgba(56, 178, 172, 0.05), transparent 70%)",
        zIndex: 0
      }}></div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <h4 style={{ 
          fontSize: "1.1rem",
          fontWeight: "700",
          color: "#38b2ac",
          marginTop: 0,
          marginBottom: "1.25rem",
          padding: "0.5rem 0.75rem",
          backgroundColor: "#b2f5ea",
          borderRadius: "6px",
          display: "inline-block"
        }}>Question {questionNumber}</h4>

        {[...Array(3)].map((_, index) => {
          if (!testCases[selectedAssignment][questionNumber][index]) {
            testCases[selectedAssignment][questionNumber][index] = { input: "", expectedOutput: "" };
          }

          return (
            <div key={index} style={{ 
              marginBottom: "1.5rem",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #99f6e4",
              background: "linear-gradient(to right, rgba(240, 253, 250, 0.6), white)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.02)"
            }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ 
                  display: "block", 
                  fontSize: "0.95rem", 
                  fontWeight: "600", 
                  color: "#115e59", 
                  marginBottom: "0.5rem" 
                }}>
                  Test Input {index + 1}:
                </label>
                <textarea
                  rows="3"
                  style={{ 
                    width: "100%", 
                    padding: "0.85rem", 
                    borderRadius: "10px", 
                    border: "1px solid #14b8a6",
                    fontSize: "0.95rem",
                    fontFamily: "monospace",
                    resize: "vertical",
                    boxShadow: "inset 0 2px 4px rgba(20, 184, 166, 0.1)",
                    backgroundColor: "white",
                    transition: "all 0.2s ease"
                  }}
                  value={testCases[selectedAssignment][questionNumber][index].input || ""}
                  onChange={(e) => handleTestCaseChange(selectedAssignment, questionNumber, "input", e.target.value, index)}
                  placeholder="Enter test input data..."
                />
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "0.95rem", 
                  fontWeight: "600", 
                  color: "#115e59", 
                  marginBottom: "0.5rem" 
                }}>
                  Expected Output {index + 1}:
                </label>
                <textarea
                  rows="3"
                  style={{ 
                    width: "100%", 
                    padding: "0.85rem", 
                    borderRadius: "10px", 
                    border: "1px solid #14b8a6",
                    fontSize: "0.95rem",
                    fontFamily: "monospace",
                    resize: "vertical",
                    boxShadow: "inset 0 2px 4px rgba(20, 184, 166, 0.1)",
                    backgroundColor: "white",
                    transition: "all 0.2s ease"
                  }}
                  value={testCases[selectedAssignment][questionNumber][index].expectedOutput || ""}
                  onChange={(e) => handleTestCaseChange(selectedAssignment, questionNumber, "expectedOutput", e.target.value, index)}
                  placeholder="Enter expected output data..."
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
})}

{/* Save Button */}
<div style={{ textAlign: "center", marginTop: "2rem" }}>
  <button 
    onClick={() => saveTestCases(selectedAssignment)} 
    style={{ 
      padding: '1rem 2.75rem', 
      backgroundColor: '#38b2ac', 
      color: 'white', 
      borderRadius: '12px', 
      cursor: 'pointer',
      border: 'none',
      fontWeight: '600',
      fontSize: '1rem',
      boxShadow: '0 8px 15px rgba(56, 178, 172, 0.15)',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <span style={{ position: 'relative', zIndex: 2 }}>💾</span>
    <span style={{ position: 'relative', zIndex: 2 }}>Save Test Cases</span>
    <div style={{
      position: 'absolute',
      top: 0,
      left: '-10%',
      width: '120%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transform: 'skewX(-15deg)',
      animation: 'shine 2s infinite',
      zIndex: 1
    }}></div>
  </button>
  <style jsx>{`
    @keyframes shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }
  `}</style>
</div>
        </section>
      )}


        {currentView === 'people' && (
          <section
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
            borderBottom: "2px solid #f1f5f9",
            paddingBottom: "0.75rem"
          }}>
            <h3 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700", 
              color: "#1e293b",
              margin: 0,
              flex: 1
            }}>
              Enrolled Students
            </h3>
            <div style={{
              backgroundColor: "#115e59",
              color: "white",
              borderRadius: "full",
              height: "2rem",
              width: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}>
              {enrolledStudents?.length || 0}
            </div>
          </div>
        
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {enrolledStudents?.length > 0 ? (
              enrolledStudents.map((enrollment) => (
                <div
                  key={enrollment.student.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f8fafc",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.2s ease",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    position: "relative"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "150px",
                    height: "100%",
                    background: "linear-gradient(to left, rgba(240, 253, 250, 0.3), transparent)",
                    zIndex: 0
                  }}></div>
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      background: `linear-gradient(135deg, #115e59 0%, #0f766e 100%)`,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontWeight: "bold",
                      marginRight: "1.25rem",
                      fontSize: "1.25rem",
                      boxShadow: "0 2px 5px rgba(17, 94, 89, 0.3)"
                    }}
                  >
                    {enrollment.student.firstName[0]}
                    {enrollment.student.lastName[0]}
                  </div>
        
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ 
                        fontWeight: "600", 
                        fontSize: "1.1rem",
                        margin: "0 0 0.25rem 0", 
                        color: "#1e293b" 
                      }}>
                        {enrollment.student.firstName} {enrollment.student.lastName}
                      </p>
                      <span style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        borderRadius: "9999px",
                        fontWeight: "500"
                      }}>
                        Student
                      </span>
                    </div>
                    <p style={{ 
                      margin: "0", 
                      color: "#64748b", 
                      fontSize: "0.95rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem"
                    }}>
                      <span style={{ fontSize: "0.85rem" }}>✉️</span>
                      {enrollment.student.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: "center",
                padding: "3rem 0",
                color: "#94a3b8"
              }}>
                <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No students enrolled yet</p>
                <p style={{ fontSize: "0.95rem" }}>Students will appear here once they join the class</p>
              </div>
            )}
          </div>
        </section>
        )}

{currentView === "Submissions" && (
  <section
    style={{
      backgroundColor: "white",
      padding: "2.5rem",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
    }}
  >
    <div 
      style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        width: "100%", 
        marginBottom: "1.75rem",
        borderBottom: "2px solid #f1f5f9",
        paddingBottom: "0.75rem"
      }}
    >
      <h3 style={{ 
        fontSize: "1.5rem", 
        fontWeight: "700", 
        color: "#1e293b",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span style={{ fontSize: "1.5rem" }}>📥</span>
        Student Submissions
      </h3>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button 
          onClick={() => selectedAssignment && evaluateSubmissions(selectedAssignment)}
          disabled={!selectedAssignment}
          style={{
            padding: "0.9rem 1.5rem",
            backgroundColor: selectedAssignment ? "#38b2ac" : "#cbd5e1",
            color: "white",
            borderRadius: "12px",
            cursor: selectedAssignment ? "pointer" : "not-allowed",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            opacity: selectedAssignment ? 1 : 0.7,
            boxShadow: selectedAssignment ? "0 6px 12px rgba(56, 178, 172, 0.2)" : "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease"
          }}
        >
          <span>⚙️</span> Evaluate Submissions
        </button>

        <button
          onClick={() => {
            if (!selectedAssignment) return alert("Please select an assignment first.");

            const code_list = submissions.map((submission, index) => {
              return `Student ${index + 1}:
      ${submission.sourcecode || ""}`;
            });

            fetch("/api/plagiarismCheck", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code_list }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (!data.results || data.results.length === 0) {
                  alert("✅ No plagiarism detected.");
                  return;
                }
                setPlagiarismResults(data.results); // ✅ Store results in state
              })
              
              .catch((error) => {
                console.error("❌ Error checking plagiarism:", error);
                alert("Error checking plagiarism: Internal Server Error");
              });
          }}
          disabled={!selectedAssignment}
          style={{
            padding: "0.9rem 1.5rem",
            backgroundColor: selectedAssignment ? "#dc2626" : "#cbd5e1",
            color: "white",
            borderRadius: "12px",
            cursor: selectedAssignment ? "pointer" : "not-allowed",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            opacity: selectedAssignment ? 1 : 0.7,
            boxShadow: selectedAssignment ? "0 6px 12px rgba(220, 38, 38, 0.2)" : "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease"
          }}
        >
          <span>🔍</span> Check Plagiarism
        </button>
      </div>
    </div>

    <div style={{ 
      background: "#f8fafc",
      borderRadius: "10px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      border: "1px solid #e2e8f0"
    }}>
      <label style={{ 
        display: "block",
        fontSize: "0.95rem",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "0.75rem" 
      }}>
        Select Assignment
      </label>
      <select
        style={{
          width: "100%",
          padding: "0.9rem 1.2rem",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          fontSize: "1rem",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.03)",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          backgroundSize: "1.25rem",
          paddingRight: "2.5rem",
          transition: "all 0.2s ease",
          cursor: "pointer"
        }}
        onChange={(e) => {
          setSelectedAssignment(e.target.value); 
          fetchSubmissions(e.target.value);
        }}
        value={selectedAssignment || ""}
      >
        <option value="">Select Assignment</option>
        {assignments.map((assignment) => (
          <option key={assignment.id} value={assignment.id}>
            {assignment.title}
          </option>
        ))}
      </select>
    </div>

    {submissions.length === 0 ? (
      <div style={{ 
        textAlign: "center",
        padding: "3rem 0",
        color: "#94a3b8",
        background: "#f8fafc",
        borderRadius: "10px",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
        <p style={{ fontSize: "1.1rem", fontWeight: "500", marginBottom: "0.5rem" }}>No submissions found</p>
        <p style={{ fontSize: "0.95rem" }}>Select an assignment to view student submissions</p>
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {submissions.map((submission,index) => {
          // Get unique plagiarism results for this student
          const studentPlagiarismResults = plagiarismResults ? 
            plagiarismResults
              .filter(r => r.file1 === `Student_${index + 1}` || r.file2 === `Student_${index + 1}`)
              .reduce((unique, match) => {
                // Only keep the highest similarity match for this student
                if (!unique.length || match.score > unique[0].score) {
                  return [match];
                }
                return unique;
              }, [])
            : [];

          return (
            <div
              key={submission.id}
              style={{
                backgroundColor: "#f8fafc",
                padding: "1.75rem",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.03)",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "150px",
                height: "100%",
                background: "linear-gradient(to left, rgba(240, 253, 250, 0.2), transparent)",
                zIndex: 0
              }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ flex: "1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{
                      width: "3rem",
                      height: "3rem",
                      background: "linear-gradient(135deg, #38b2ac 0%, #319795 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      boxShadow: "0 6px 12px rgba(56, 178, 172, 0.2)"
                    }}>
                      {submission.student.firstName[0]}
                      {submission.student.lastName[0]}
                    </div>
                    <div>
                          <p style={{ fontWeight: "600", margin: 0, color: "#1e293b", fontSize: "1.1rem" }}>
                            {submission.student.firstName} {submission.student.lastName}
                          </p>
                          <p style={{ 
                            margin: "0.2rem 0 0 0", 
                            color: "#64748b", 
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem"
                          }}>
                            <span style={{ fontSize: "0.85rem" }}>✉️</span>
                            {submission.student.email}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                        <div style={{
                          padding: "0.5rem 0.75rem",
                          backgroundColor: "rgba(56, 178, 172, 0.1)",
                          color: "#38b2ac",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}>
                          <span>📌</span>
                          Question: {submission.questionNumber}
                        </div>
                        
                        <div style={{
                          padding: "0.5rem 0.75rem",
                          backgroundColor: submission.checked ? "rgba(56, 178, 172, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          color: submission.checked ? "#38b2ac" : "#ef4444",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}>
                          <span>{submission.checked ? "✅" : "❌"}</span>
                          Status: {submission.checked ? "Checked" : "Unchecked"}
                        </div>
                      </div>

                    {studentPlagiarismResults.length > 0 && (
                      <div style={{ 
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        borderRadius: "8px",
                        border: "1px solid rgba(239, 68, 68, 0.2)"
                      }}>
                        <button
                          onClick={() => openPlagiarismPanel(studentPlagiarismResults[0])}
                          style={{
                            backgroundColor: "#38b2ac",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem"
                          }}
                        >
                          <span>🔍</span> View Plagiarism Report 
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        backgroundColor: "#38b2ac",
                      color: "white",
                        padding: "0.9rem 1.5rem",
                        borderRadius: "12px",
                      textDecoration: "none",
                        fontWeight: "600",
                        height: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 6px 12px rgba(56, 178, 172, 0.2)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>👁️</span> View Submission
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          

          
        </section>
      )}


        {currentView === 'grades' && (
         <section
         style={{
           backgroundColor: "white",
           padding: "2rem",
           borderRadius: "12px",
           boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
           maxWidth: "800px",
           margin: "0 auto",
         }}
       >
         <div style={{
           display: "flex",
           alignItems: "center",
           marginBottom: "1.75rem",
           borderBottom: "2px solid #f1f5f9",
           paddingBottom: "0.75rem"
         }}>
           <h3 style={{ 
             fontSize: "1.5rem", 
             fontWeight: "700", 
             color: "#1e293b",
             margin: 0,
             display: "flex",
             alignItems: "center",
             gap: "0.5rem"
           }}>
             <span style={{ fontSize: "1.5rem" }}>📊</span>
             Student Grades
           </h3>
         </div>
     
   {/* Assignment Selection */}
   <div style={{ 
     background: "#f8fafc",
     borderRadius: "10px",
     padding: "1.5rem",
     marginBottom: "1.5rem",
     border: "1px solid #e2e8f0"
   }}>
     <label style={{ 
       display: "block",
       fontSize: "0.95rem",
       fontWeight: "600",
       color: "#475569",
       marginBottom: "0.75rem" 
     }}>
       Select Assignment
     </label>
     <select
       value={selectedAssignment || ""} 
       onChange={(e) => setSelectedAssignment(e.target.value)}
       style={{
         width: "100%",
         padding: "0.75rem 1rem",
         borderRadius: "8px",
         border: "1px solid #cbd5e1",
         fontSize: "1rem",
         backgroundColor: "white",
         boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
         appearance: "none",
         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
         backgroundRepeat: "no-repeat",
         backgroundPosition: "right 1rem center",
         backgroundSize: "1.25rem",
         paddingRight: "2.5rem"
       }}
     >
       <option value="">Select Assignment</option>
       {assignments.map((assignment) => (
         <option key={assignment.id} value={assignment.id}>
           {assignment.title}
         </option>
       ))}
     </select>
   </div>

     {loadingResults ? (
       <div style={{ 
         textAlign: "center", 
         padding: "3rem 0",
         color: "#64748b"
       }}>
         <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
         <p style={{ fontSize: "1.1rem" }}>Loading grades...</p>
       </div>
     ) : results.length === 0 ? (
       <div style={{ 
         textAlign: "center",
         padding: "3rem 0",
         color: "#94a3b8",
         background: "#f8fafc",
         borderRadius: "10px",
         border: "1px solid #e2e8f0"
       }}>
         <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
         <p style={{ fontSize: "1.1rem", fontWeight: "500", marginBottom: "0.5rem" }}>No grades available</p>
         <p style={{ fontSize: "0.95rem" }}>Select an assignment to view student grades</p>
       </div>
     ) : (
       <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
         {results.map((grade, index) => (
           <div
             key={index}
             style={{
               backgroundColor: "#f8fafc",
               padding: "1.5rem",
               borderRadius: "10px",
               color: "#555",
               boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
               border: "1px solid #e2e8f0",
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
             }}
           >
             <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
               <div style={{
                 width: "3rem",
                 height: "3rem",
                 background: `linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)`,
                 borderRadius: "50%",
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center",
                 color: "white",
                 fontWeight: "bold",
                 fontSize: "1.1rem"
               }}>
                 {grade.student.firstName[0]}
                 {grade.student.lastName[0]}
               </div>
               <div>
                 <p style={{ 
                   fontWeight: "600", 
                   margin: "0 0 0.25rem 0", 
                   color: "#1e293b",
                   fontSize: "1.1rem" 
                 }}>
                   {grade.student.firstName} {grade.student.lastName}
                 </p>
                 <p style={{ 
                   color: "#64748b", 
                   margin: 0,
                   fontSize: "0.9rem",
                   display: "flex",
                   alignItems: "center",
                   gap: "0.35rem" 
                 }}>
                   <span style={{ fontSize: "0.85rem" }}>📝</span>
                   {grade.assignment.title}
                 </p>
               </div>
             </div>
             
             <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
               <div>
                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                   <div style={{ 
                     width: "5rem", 
                     height: "0.5rem", 
                     backgroundColor: "#e2e8f0", 
                     borderRadius: "9999px",
                     overflow: "hidden"
                   }}>
                     <div 
                       style={{ 
                         width: `${grade.score}%`, 
                         height: "100%", 
                         backgroundColor: getScoreColor(grade.score),
                         transition: "width 1s ease-in-out"
                       }}
                     ></div>
                   </div>
                   <span style={{ 
                     color: getScoreColor(grade.score), 
                     fontWeight: "600",
                     fontSize: "0.95rem"
                   }}>
                     {grade.score.toFixed(1)}%
                   </span>
                 </div>
               </div>
               
               <div style={{
                 padding: "0.6rem 1.2rem",
                 backgroundColor: getGradeColor(grade.grade),
                 color: "white",
                 borderRadius: "10px",
                 fontWeight: "600",
                 fontSize: "1.1rem",
                 minWidth: "3rem",
                 textAlign: "center",
                 boxShadow: "0 4px 8px rgba(15, 118, 110, 0.15)"
               }}>
                 {grade.grade}
               </div>
             </div>
           </div>
         ))}
       </div>
     )}
       </section>
        )}
      </main>
   {selectedPlagiarismMatch && (
  <div style={{
    position: "fixed",
    top: 0,
    right: 0,
    width: "40%",
    height: "100vh",
    backgroundColor: "#fff",
    boxShadow: "-5px 0 25px rgba(0,0,0,0.15)",
    padding: "2rem",
    overflowY: "scroll",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column"
  }}>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      borderBottom: "2px solid #f1f5f9",
      paddingBottom: "1rem"
    }}>
      <h3 style={{ 
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span>📋</span> Plagiarism Report
      </h3>
      <button
        onClick={() => setSelectedPlagiarismMatch(null)}
        style={{
          backgroundColor: "transparent",
          color: "#64748b",
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.25rem",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        ✕
      </button>
    </div>

    <div style={{
      backgroundColor: "#f8fafc",
      borderRadius: "10px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      border: "1px solid #e2e8f0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h4 style={{ 
            margin: "0 0 0.25rem 0", 
            color: "#1e293b",
            fontSize: "1.1rem",
            fontWeight: "600"
          }}>
            Comparison
          </h4>
          <p style={{ 
            color: "#64748b", 
            margin: 0,
            fontSize: "0.95rem" 
          }}>
            {selectedPlagiarismMatch.file1} vs {selectedPlagiarismMatch.file2}
          </p>
        </div>
        <div style={{
          backgroundColor: getSimilarityColor(selectedPlagiarismMatch.score),
          color: "white",
          fontWeight: "bold",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          fontSize: "1.25rem",
          boxShadow: `0 2px 4px ${getSimilarityColor(selectedPlagiarismMatch.score, 0.3)}`
        }}>
          {selectedPlagiarismMatch.score}%
        </div>
      </div>
      
      <div style={{
        width: "100%",
        height: "0.5rem",
        backgroundColor: "#e2e8f0",
        borderRadius: "9999px",
        overflow: "hidden",
        marginBottom: "1rem"
      }}>
        <div style={{
          width: `${selectedPlagiarismMatch.score}%`,
          height: "100%",
          backgroundColor: getSimilarityColor(selectedPlagiarismMatch.score),
          transition: "width 1s ease-in-out"
        }}></div>
      </div>
      
      <div style={{
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        backgroundColor: selectedPlagiarismMatch.score > 80 ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)",
        borderLeft: `4px solid ${getSimilarityColor(selectedPlagiarismMatch.score)}`,
        color: getSimilarityColor(selectedPlagiarismMatch.score),
        fontSize: "0.95rem",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span>{selectedPlagiarismMatch.score > 80 ? "⚠️" : "ℹ️"}</span>
        {selectedPlagiarismMatch.score > 80 
          ? "High probability of plagiarism detected" 
          : selectedPlagiarismMatch.score > 50 
            ? "Moderate similarity detected" 
            : "Low similarity detected"}
      </div>
    </div>

    {/* Code Comparison Panel */}
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      marginBottom: "1rem"
    }}>
      <div style={{ 
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        background: "#f8fafc"
      }}>
        <div style={{ 
          padding: "0.75rem 1rem",
          backgroundColor: "#f1f5f9",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: "600",
          color: "#1e293b",
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span style={{ color: "#4f46e5" }}>📄</span>
          {selectedPlagiarismMatch.file1}
        </div>
        <pre style={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.9rem",
          backgroundColor: "#fff",
          overflowX: "auto",
          maxWidth: "100%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "monospace",
          color: "#334155",
          borderRadius: "0 0 10px 10px"
        }}>
         <code>{selectedPlagiarismMatch.code1}</code>

        </pre>
      </div>

      <div style={{ 
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        background: "#f8fafc"
      }}>
        <div style={{ 
          padding: "0.75rem 1rem",
          backgroundColor: "#f1f5f9",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: "600",
          color: "#1e293b",
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span style={{ color: "#4f46e5" }}>📄</span>
          {selectedPlagiarismMatch.file2}
        </div>
        <pre style={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.9rem",
          backgroundColor: "#fff",
          overflowX: "auto",
          maxWidth: "100%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "monospace",
          color: "#334155",
          borderRadius: "0 0 10px 10px"
        }}>
         <code>{selectedPlagiarismMatch.code2}</code>

        </pre>
      </div>
    </div>

    {/* AI Insight */}
    <div style={{
      padding: "1.25rem",
      backgroundColor: "rgba(56, 178, 172, 0.05)",
      borderRadius: "10px",
      marginBottom: "1.5rem",
      border: "1px solid rgba(56, 178, 172, 0.2)"
    }}>
      <h4 style={{ 
        margin: "0 0 0.75rem 0",
        color: "#38b2ac",
        fontSize: "1rem",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <span>💡</span> AI Insight
      </h4>
      <p style={{ 
        margin: 0, 
        color: "#38b2ac", 
        fontSize: "0.95rem", 
        lineHeight: 1.5 
      }}>
        This code closely resembles {selectedPlagiarismMatch.file2}'s solution with only minor variable name changes. 
        {selectedPlagiarismMatch.score > 80 && " Possible copy-paste attempt with minimal modifications."}
        {selectedPlagiarismMatch.score > 50 && selectedPlagiarismMatch.score <= 80 && " Shows structural similarities but has some differences."}
        {selectedPlagiarismMatch.score <= 50 && " Shows some similarities but likely not intentional plagiarism."}
      </p>
    </div>

    <button
      onClick={() => setSelectedPlagiarismMatch(null)}
      style={{
        marginTop: "auto",
        backgroundColor: "#38b2ac",
        color: "white",
        padding: "0.8rem 0",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "1rem",
        boxShadow: "0 2px 4px rgba(56, 178, 172, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem"
      }}
    >
      <span>✕</span> Close Report
    </button>
  </div>
)}
        {/* Modals */}
        {modalType === "announcement" && selectedItem && (
  <AnnouncementDetails 
    announcement={selectedItem} 
    onClose={closeModal} 
    refreshData={fetchAnnouncements}
    saveEdit={saveEditedAnnouncement}
    isTeacher={true}
  />
)}
       {modalType === "assignment" && selectedItem && 
  <AssignmentDetails 
    assignment={selectedItem} 
    onClose={closeModal} 
    refreshData={fetchAssignments} 
    saveEdit={saveEditedAssignment}
    isTeacher={true}
  />
}
{/* MATERIAL MODAL */}
{modalType === "material" && selectedItem && (
  <MaterialDetails 
    material={selectedItem} 
    onClose={closeModal} 
    refreshData={fetchMaterials}
    saveEdit={saveEditedMaterial}
    isTeacher={true}
  />
)}

{/* ACTIVITY MODAL */}
{modalType === "activity" && selectedItem && (
  <ActivityDetails 
    activity={selectedItem} 
    onClose={closeModal} 
    refreshData={fetchActivities}
    saveEdit={saveEditedActivity}
    isTeacher={true}
  />
)}

      {/* Enrolled Students Card */}
      {isStudentsCardVisible && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: "10px"
          }}
        >
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            position: 'relative',
          }}>
            {/* Close button for the students card */}
            <button
              onClick={() => setStudentsCardVisible(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                border: 'none',
                background: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ✕
            </button>
            {/* Content would go here */}
          </div>
        </div>
      )}
    </div>
  );
}
