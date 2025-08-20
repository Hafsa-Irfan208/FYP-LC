"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Classwork from "../Classwork/page";
import { uploadFileToS3 } from "@/utils/s3";
// import { getCodeSuggestion } from '@/utils/gemini';
import { useSession } from "next-auth/react";
import AssignmentDetails from "../Tassignments/AssignmentDetails";
import AnnouncementDetails from "../Tassignments/AnnouncementDetails";
import MaterialDetails from "../Tassignments/MaterialDetails"; // NEW COMPONENT
import ActivityDetails from "../Tassignments/ActivityDetails"; // NEW COMPONENT


export default function StudentStream() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { data: session } = useSession();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStudentsCardVisible, setStudentsCardVisible] = useState(false);
  const [currentView, setCurrentView] = useState("stream");
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [testCases, setTestCases] = useState({});
  const [currentTeacher, setCurrentTeacher] = useState("");
  const [output, setOutput] = useState({});
  const [enrolledStudents, setEnrolledStudents] = useState([]); // Store enrolled students here
  const [announcements, setAnnouncements] = useState([]); // Store fetched announcements
  const [modalType, setModalType] = useState("");
  const [materials, setMaterials] = useState([]);  // ✅ NEW STATE
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // Track editing announcement or assignment
  const [editedContent, setEditedContent] = useState(""); // Temporary storage for edited text
  const [activities, setActivities] = useState([]); // ✅ NEW STATE
  const [grades, setgrades] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [grokSuggestions, setGrokSuggestions] = useState([]);
  // ✅ Add this at the top where other state variables are defined
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Default question number
  const [submissions, setSubmissions] = useState([]); // ✅ This fixes the issue
const [isOverdue, setIsOverdue] = useState(false);



  

  useEffect(() => {
    if (session?.user?.name) {
      setCurrentTeacher(session.user.name); // Fetch logged-in teacher's name dynamically
    }
  }, [session]);

  // Handle File Selection
  const [submittedFiles, setSubmittedFiles] = useState({}); // ✅ Track submitted files
  useEffect(() => {
    if (courseId) {
      fetchAssignments();
      fetchAnnouncements();
      fetchEnrolledStudents();
    }
  }, [courseId], assignments, announcements);

  useEffect(() => {
    if (courseId) {
      fetchMaterials();
    }
  }, [courseId, materials]); // Fetch only when courseId changes

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

        console.log("✅ Course Data:", courseData);

        // // ✅ Use teacherName from API Response
        setCurrentTeacher(courseData.teacherName || "Unknown Teacher");


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
  const fetchEnrolledStudents = async () => {
    try {
      if (!courseId) return;
      console.log("📡 Fetching enrolled students...");

      const response = await fetch(`/api/get-enrolled-students?courseId=${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch enrolled students.");

      const studentsData = await response.json();
      console.log("✅ Fetched Enrolled Students:", studentsData); // Debugging Log

      // ✅ Check if enrollments exist
      if (Array.isArray(studentsData)) {
        setEnrolledStudents(studentsData);
      } else {
        console.warn("⚠️ Unexpected data format for students:", studentsData);
        setEnrolledStudents([]); // Ensure it doesn't break UI
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      setEnrolledStudents([]); // Default to empty array if API fails
    }
  };


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

  // const handleAssignmentSelect = (assignment) => {
  //   console.log("📌 Selected Assignment:", assignment);
  //   setSelectedAssignment(assignment);
  // };

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

  const handleFileChange = (e, assignmentId, questionNumber) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => ({
      ...prev,
      [`${assignmentId}-${questionNumber}`]: file,
    }));
  };

  const handleSubmitFile = async (assignmentId, questionNumber) => {
    if (!selectedFiles[`${assignmentId}-${questionNumber}`]) {
      alert("⚠️ Please select a file before submitting.");
      return;
    }
    setUploading(true);

    try {
      const file = selectedFiles[`${assignmentId}-${questionNumber}`];

      // Read the C++ file as text
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        try {
          const sourceCode = reader.result;

          // ✅ Upload to S3
          const fileName = `${Date.now()}-${file.name}`;
          const fileUrl = await uploadFileToS3(file, fileName);

          if (!fileUrl) {
            throw new Error("❌ Failed to upload file to S3.");
          }

          const submittedAt = new Date().toISOString();

          // ✅ Submit to Backend API
          await submitToBackend(assignmentId, questionNumber, sourceCode, submittedAt, fileUrl);

          // ✅ Store the submitted file link after success
          setSubmittedFiles((prev) => ({
            ...prev,
            [`${assignmentId}-${questionNumber}`]: fileUrl,
          }));

          alert("✅ File submitted successfully!");
        } catch (error) {
          console.error("❌ Error processing file:", error);
          alert("An error occurred while processing the file.");
        }
      };
    } catch (error) {
      console.error("❌ Error during submission:", error);
      alert("An error occurred while submitting the file.");
    } finally {
      setUploading(false);
    }
  };


  const submitToBackend = async (assignmentId, questionNumber, sourceCode, submittedAt, fileUrl) => {
    try {
      console.log("📡 Submitting file to backend...");

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: session?.user?.id,
          assignmentId,
          submittedAt,
          questionNumber,
          sourceCode,
          fileUrl,
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend Error:", errorText);
        alert(`⚠️ Submission failed: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log("✅ Submission Success:", data);
      alert("✅ File submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting to backend:", error);
      alert("An unexpected error occurred while submitting.");
    }
  };

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

    // Assuming assignments is an array and you want to find the full assignment object
    const assignment = assignments.find((a) => a.id.toString() === assignmentId);
    setSelectedAssignment(assignment);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    alert("There was an error fetching the submissions. Please try again later.");
  }
};
  const handleAssignmentSelect = (assignment) => {  
    console.log("📌 Selected Assignment:", assignment)
    setSelectedAssignment(assignment);
    setSelectedQuestion(assignment.questionNumber); // Set the question number dynamically
    fetchSubmissions(assignment.id); // Fetch submissions for the selected assignment

    // fetchTestCases(assignment.id); // Fetch test cases for the selected assignment
  };

  // Fetch Test Cases for Each Assignment
  useEffect(() => {
    const fetchTestCases = async () => {
      let fetchedTestCases = {};
      for (let assignment of assignments) {
        try {
          const res = await fetch(`/api/testcases?assignmentId=${assignment.id}`);

          // ✅ Check if response is empty or not OK
          if (!res.ok) {
            console.warn(`⚠️ No test cases found for assignment ${assignment.id}`);
            continue;
          }

          const text = await res.text(); // ✅ Read response as text first
          if (!text.trim()) {
            console.warn(`⚠️ Empty response for assignment ${assignment.id}`);
            fetchedTestCases[assignment.id] = []; // Set empty array
            continue;
          }

          const data = JSON.parse(text); // ✅ Now safely parse JSON

          // ✅ Extract question numbers dynamically
          const questionNumbers = [...new Set(data.testCases.map((tc) => tc.questionNumber))];
          fetchedTestCases[assignment.id] = questionNumbers;
        } catch (error) {
          console.error(`❌ Error fetching test cases for assignment ${assignment.id}:`, error);
          fetchedTestCases[assignment.id] = []; // Prevent breaking the UI
        }
      }
      setTestCases(fetchedTestCases);
    };

    if (assignments.length > 0) {
      fetchTestCases();
    }
  }, [assignments]);

  // Fetch Results
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);


  useEffect(() => {
    const fetchResults = async () => {
      if (!session?.user?.id || currentView !== "Results") return;
      setLoadingResults(true);

      try {
        console.log("Fetching results for student:", session.user.id);

        const response = await fetch(`/api/get-evaluation?studentId=${session.user.id}`);

        if (!response.ok) {
          console.error("❌ API Request Failed:", response.status, response.statusText);
          setResults([]);
          return;
        }

        const data = await response.json();
        console.log("✅ API Response Data:", data); // ✅ Debug API response

        // ✅ Ensure the response is an array
        if (!Array.isArray(data)) {
          console.error("❌ Error: API response is not an array", data);
          setResults([]);
          return;
        }

        // ✅ Parse JSON results safely
        const formattedResults = data.map((evaluation) => ({
          ...evaluation,
          results: (() => {
            try {
              return JSON.parse(evaluation.results || "[]");
            } catch (error) {
              console.error("❌ JSON Parse Error:", error, evaluation.results);
              return [];
            }
          })(),
        }));

        console.log("✅ Parsed Results:", formattedResults);
        setResults(formattedResults);

      } catch (error) {
        console.error("❌ Network error fetching results:", error);
        setResults([]);
      }

      setLoadingResults(false);
    };

    fetchResults();

  }, [session?.user?.id, currentView]);


  useEffect(() => {
    const fetchResults = async () => {
      if (!session?.user?.id || currentView !== "Results") return;
      setLoadingResults(true);

      try {
        console.log("📡 Fetching results for student:", session.user.id);

        const response = await fetch(`/api/get-evaluation?studentId=${session.user.id}`);

        if (!response.ok) {
          console.error("❌ API Request Failed:", response.status, response.statusText);
          setResults([]); // Ensure UI updates even if API fails
          return;
        }

        const text = await response.text();  // ✅ Read response as text
        console.log("📌 Raw API Response:", text); // ✅ Debugging

        let data;
        try {
          data = JSON.parse(text);  // ✅ Parse JSON
        } catch (error) {
          console.error("❌ JSON Parsing Error:", error);
          setResults([]);
          return;
        }

        console.log("✅ Parsed Results Data:", data); // ✅ Debug API response

        if (!Array.isArray(data)) {
          console.error("❌ API response is not an array:", data);
          setResults([]);
          return;
        }

        // ✅ Fix: Ensure `results` is always an array of objects
        const formattedResults = data.map((evaluation) => ({
          ...evaluation,
          results: (() => {
            try {
              return JSON.parse(evaluation.results || "[]"); // ✅ Handle empty or malformed JSON
            } catch (error) {
              console.error("❌ JSON Parse Error:", error, evaluation.results);
              return [];
            }
          })(),
        }));

        console.log("✅ Formatted Results:", formattedResults);
        setResults(formattedResults);

      } catch (error) {
        console.error("❌ Network error fetching results:", error);
        setResults([]);
      }

      setLoadingResults(false);
    };

    fetchResults();
  }, [session?.user?.id, currentView]);


  const saveGradeToDB = async (studentId, assignmentId, score, grade) => {
    try {
      const response = await fetch("/api/save-grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, assignmentId, score, grade }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Grade saved successfully:", data.result);
      } else {
        console.error("❌ Error saving grade:", data.error);
      }
    } catch (error) {
      console.error("❌ Network error saving grade:", error);
    }
  };
const [studentCode, setStudentCode] = useState('');

const fetchSuggestions = async (qno) => {
    const studentId = session?.user?.id;
    const assignmentId = selectedAssignment?.id;
    const questionNumber = qno;

    if (!studentId || !questionNumber|| !assignmentId || currentView !== "GeminiAI") {
      console.warn("⚠️ Missing required parameters or not in correct view.");
      return;
    }

    setLoadingSuggestions(true);
    setError('');
    setStudentCode('');

    try {
      const response = await fetch(`/api/gemini-suggestion?courseId=${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          questionNumber,
          studentId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStudentCode(data.suggestion || 'No code available.');
      } else {
        setError(data.error || 'Failed to fetch source code.');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching data.');
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
 useEffect(() => {
  // const fetchSuggestions = async () => {
  //   const studentId = session?.user?.id;
  //   const assignmentId = selectedAssignment?.id;
  //   const questionNumber = selectedQuestion;

  //   if (!studentId || !assignmentId || currentView !== "GeminiAI") {
  //     console.warn("⚠️ Missing required parameters or not in correct view.");
  //     return;
  //   }

  //   setLoadingSuggestions(true);
  //   setError('');
  //   setStudentCode('');

  //   try {
  //     const response = await fetch(`/api/gemini-suggestion?courseId=${courseId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         assignmentId,
  //         questionNumber,
  //         studentId,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setStudentCode(data.suggestion || 'No code available.');
  //     } else {
  //       setError(data.error || 'Failed to fetch source code.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError('Error fetching data.');
  //   } finally {
  //     setLoadingSuggestions(false);
  //   }
  // };

  //fetchSuggestions();
}, [
  session?.user?.id,
  currentView,
  selectedAssignment?.id,
  selectedQuestion,
  courseId, // <- Include this if used in fetch URL
]);
useEffect(() => {
    if (!submissions || submissions.length === 0) return; // Ensure submissions are present

    const code_list = submissions.map((submission, index) => {
      return `Student ${index + 1}:\n${submission.sourcecode || ""}`;
    });

    console.log("Sending code list to plagiarism check:", code_list);

    fetch("/api/plagiarismCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code_list }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Plagiarism check response:", data);

        if (!data.results || data.results.length === 0) {
          console.log("✅ No plagiarism detected.");
          setPlagiarismResults([]); // Clear if no results
          setEvaluationReady(true); // Allow rendering
          return;
        }

        // Log results if plagiarism is found
        console.log("Plagiarism results found:", data.results);

        // Extract plagiarism scores and set state
        const scores = data.results.map((result, index) => {
          // Ensure plagiarism_score exists and log it
          const plagiarismScore = result.plagiarism_score || 0;
          console.log(`Plagiarism score for student ${index + 1}:`, plagiarismScore);
          return plagiarismScore;
        });

        setPlagiarismResults(scores);
        setEvaluationReady(true); // ✅ Trigger rendering
      })
      .catch((error) => {
        console.error("❌ Error checking plagiarism:", error);
        alert("Error checking plagiarism: Internal Server Error");
      });
  }, [submissions]);
const [plagiarismData, setPlagiarismData] = useState(null);
const [loadingPlagiarism, setLoadingPlagiarism] = useState(false);
useEffect(() => {
  const fetchPlagiarism = async () => {
    setLoadingPlagiarism(true);
    try {
      const res = await fetch('/api/getPlagiarismResults?submissionId=15');
      if (!res.ok) throw new Error('Failed to fetch plagiarism');
      const data = await res.json();
      setPlagiarismData(data);
    } catch (error) {
      console.error('Error fetching plagiarism:', error);
      setPlagiarismData(null);
    }
    setLoadingPlagiarism(false);
  };

  fetchPlagiarism();
}, []);



  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-teal-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Course Found</h2>
            <p className="text-gray-600 mb-6">The requested course could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-stream-container" style={{ 
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
          { name: 'Classwork', view: 'classwork', icon: '📝' },
          { name: 'People', view: 'people', icon: '👥' },
          { name: 'Results', view: 'Results', icon: '📊' },
          { name: 'Gemini AI', view: 'GeminiAI', icon: '🤖' }
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

           {/* Enhanced Assignments Section */}
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
                     {assignments.map((assignment) => {
                       const dueDate = new Date(assignment.dueDate);
                       const today = new Date();
                       const isAssignmentOverdue = dueDate < today;
                       
                       return (
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
                           onClick={() => {
                             setIsOverdue(isAssignmentOverdue);
                             openModal(assignment, "assignment");
                           }}
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
                                 {currentTeacher} has created a new assignment: <span style={{ color: '#115e59' }}>{assignment.title}</span>
                               </p>
                               <p style={{ 
                                 fontSize: '0.875rem',
                                 color: isAssignmentOverdue ? '#dc2626' : '#64748b',
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '0.25rem',
                                 fontWeight: isAssignmentOverdue ? '500' : 'normal'
                               }}>
                                 <span style={{ fontSize: '0.75rem' }}>{isAssignmentOverdue ? '⏰' : '📅'}</span>
                                 Due: {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                                   year: 'numeric',
                                   month: 'short',
                                   day: 'numeric'
                                 })}
                                 {isAssignmentOverdue && <span style={{ marginLeft: '0.5rem', color: '#dc2626' }}>Overdue</span>}
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                     })}
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
          </section>
        )}

        {/* ✅ Classwork Section */}
        {currentView === 'classwork' && <Classwork />}

        {/* ✅ People Section */}
        {currentView === 'people' && (
          <section
            style={{
              backgroundColor: "white",
              padding: "2.5rem",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
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
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <span style={{ fontSize: "1.5rem" }}>👥</span>
                Enrolled Students
              </h3>
              <div style={{
                backgroundColor: "#115e59",
                color: "white",
                borderRadius: "9999px",
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
          
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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

         {/* ✅ Results Section */}
         {currentView === "Results" && (
          <section
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              Results
            </h3>

            {loadingResults ? (
              <p>Loading results...</p>
            ) : results.length > 0 ? (
              <ul>
                {/* ✅ Group evaluations by assignmentId */}
                {Object.entries(
                  results.reduce((acc, evaluation) => {
                    if (!acc[evaluation.assignmentId]) {
                      acc[evaluation.assignmentId] = [];
                    }
                    acc[evaluation.assignmentId].push(evaluation);
                    return acc;
                  }, {})
                ).map(([assignmentId, assignmentResults]) => {
                  // ✅ Merge all results for the same assignment
                  let questionResults = {};
                  let totalQuestions = 0;
                  let correctQuestions = 0;
                  let totalPlagiarismPenalty = 0;
                  

                  assignmentResults.forEach((evaluation) => {
                    let parsedResults = [];
                    try {
                      parsedResults = typeof evaluation.results === "string"
                        ? JSON.parse(evaluation.results)
                        : evaluation.results;
                    } catch (error) {
                      console.error("❌ Error parsing results:", error);
                    }

                    parsedResults.forEach((q) => {
                      totalQuestions += 1;
                      if (q.passed) correctQuestions += 1; // ✅ Count correct answers
    const totalPlagScore = plagiarismData ? Math.floor(plagiarismData.plagiarismScore) : 0;
   const plagiarismScore = totalQuestions > 0 ? Math.floor(totalPlagScore / totalQuestions) : 0;
    totalPlagiarismPenalty +=  plagiarismScore / 2;
  if (!questionResults[q.questionNumber]) {
      questionResults[q.questionNumber] = { statuses: [], plagiarismScores: [] };
    }
    questionResults[q.questionNumber].statuses.push(q.passed);
    questionResults[q.questionNumber].plagiarismScores.push(plagiarismScore);
  });
});
                 let rawScore = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;
let adjustedScore = rawScore - totalPlagiarismPenalty;
if (adjustedScore < 0) adjustedScore = 0;

// Determine grade based on adjusted score
let grade = "F";
if (adjustedScore >= 90) grade = "A+";
else if (adjustedScore >= 80) grade = "A";
else if (adjustedScore >= 70) grade = "B";
else if (adjustedScore >= 60) grade = "C";

// Save grade to DB
saveGradeToDB(
  assignmentResults[0].studentId,
  assignmentId,
  adjustedScore,
  grade
);

                  return (
                    <li
                      key={assignmentId}
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        marginBottom: "1rem",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                      }}
                    >
                      {/* ✅ Display Grade at the Top Right */}
                      <span
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          backgroundColor: grade === "A+" ? "#4CAF50" :
                            grade === "A" ? "#2196F3" :
                              grade === "B" ? "#FFC107" :
                                grade === "C" ? "#FF9800" : "#F44336",
                          color: "white",
                        }}
                      >
                        {grade} ({adjustedScore.toFixed(1)}%)
                      </span>

                      <h3
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#333",
                          marginBottom: "0.8rem",
                        }}
                      >
                        {assignmentResults[0].assignmentTitle || `Assignment ${assignmentId}`}
                      </h3>

                      {/* ✅ Display Question Number and Status */}
                    {Object.entries(questionResults).map(([questionNumber, { statuses, plagiarismScores }]) => {
  const allPassed = statuses.every((status) => status);
  const avgPlagiarismScore = plagiarismScores.length > 0
    ? Math.floor(plagiarismScores.reduce((a, b) => a + b, 0) / plagiarismScores.length)
    : 0;

                        return (
                          <p
                            key={questionNumber}
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              color: allPassed ? "green" : "red",
                            }}
                          >
                            Question {questionNumber}: {allPassed ? "✅ Correct" : "❌ Incorrect"}
                             {avgPlagiarismScore > 0 && (
              <span style={{ color: "#FF5722", marginLeft: "0.5rem" }}>
                (Plagiarism Detected)
              </span>
            )}
                          </p>
                        );
                      })}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p style={{ color: "#999" }}>No results available.</p>
            )}
          </section>
        )}
      
        {/* Gemini AI Section */}
        {currentView === "GeminiAI" && (
          <section
            style={{
              backgroundColor: "white",
              padding: "2.5rem",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
              backgroundImage: "linear-gradient(to bottom right, rgba(56, 178, 172, 0.03), transparent)"
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
                <span style={{ fontSize: "1.5rem" }}>🤖</span>
                Gemini AI Code Suggestions
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
                <p style={{ 
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(56, 178, 172, 0.1)",
                  border: "1px solid rgba(56, 178, 172, 0.1)",
                  color: "#115e59",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1rem" }}>💡</span>
                  Select an assignment and question to get AI-powered code suggestions and help.
                </p>

                {/* Assignment Dropdown */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ 
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "0.5rem"
                  }}>
                    Select Assignment
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
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
                    onChange={(e) => {
                      const assignmentId = e.target.value;
                      const assignment = assignments.find((a) => a.id.toString() === assignmentId);
                      setSelectedAssignment(assignment);
                      setSelectedQuestion(null); // Reset the question when assignment changes
                      setStudentCode("");
                      
                      // Fetch submissions related to the selected assignment
                      fetchSubmissions(assignmentId);
                    }}
                    value={selectedAssignment?.id?.toString() || ""}
                  >
                    <option value="">Select Assignment</option>
                    {assignments.map((assignment) => (
                      <option key={assignment.id} value={assignment.id.toString()}>
                        {assignment.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Dropdown (Based on Submissions) */}
                {submissions.length > 0 && selectedAssignment && (
                  <div>
                    <label style={{ 
                      display: "block",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#475569",
                      marginBottom: "0.5rem"
                    }}>
                      Select Question
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
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
                      onChange={(e) => {
                        console.log(e.target.value)
                        setSelectedQuestion(Number(e.target.value)); // Set selected question
                        setStudentCode(""); // Clear any previous student code or related data
                        fetchSuggestions(Number(e.target.value)); // Fetch suggestions based on selected question
                      }}
                      value={selectedQuestion || ""}
                    >
                      <option value="">Select Question</option>
                      {[
                        ...new Set(submissions.map((submission) => submission.questionNumber)), // Get unique question numbers from submissions
                      ].map((q) => (
                        <option key={q} value={q}>
                          Question {q}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Suggestion Output */}
            {loadingSuggestions ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem 0",
                color: "#64748b"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
                <p style={{ fontSize: "1.1rem" }}>Fetching AI suggestions...</p>
              </div>
            ) : error ? (
              <div style={{ 
                textAlign: "center",
                padding: "2rem",
                backgroundColor: "#fef2f2",
                borderRadius: "12px",
                border: "1px solid #fee2e2"
              }}>
                <div style={{
                  width: "4rem",
                  height: "4rem",
                  backgroundColor: "#fee2e2",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.5rem"
                }}>
                  ⚠️
                </div>
                <h4 style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#b91c1c",
                  margin: "0 0 0.5rem 0"
                }}>
                  Error
                </h4>
                <p style={{
                  fontSize: "1rem",
                  color: "#ef4444",
                  margin: 0
                }}>
                  {error}
                </p>
              </div>
            ) : studentCode ? (
              <div style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.03)",
                border: "1px solid #e2e8f0"
              }}>
                <div style={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem"
                }}>
                  <div style={{
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "#ccfbf1",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.5rem"
                  }}>
                    🚀
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#115e59",
                      margin: "0 0 0.25rem 0"
                    }}>
                      AI Suggestion
                    </h4>
                    <p style={{
                      fontSize: "0.95rem",
                      color: "#475569",
                      margin: 0
                    }}>
                      For {selectedAssignment?.title} - Question {selectedQuestion}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                  color: "#334155",
                  whiteSpace: "pre-wrap",
                  maxHeight: "400px",
                  overflowY: "auto",
                  border: "1px solid #e2e8f0"
                }}>
                  {studentCode}
                </div>
              </div>
            ) : (
              selectedAssignment && selectedQuestion && (
                <div style={{ 
                  textAlign: "center",
                  padding: "3rem 0",
                  color: "#94a3b8",
                  backgroundColor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                  <p style={{ fontSize: "1.1rem" }}>No suggestions available.</p>
                  <p style={{ fontSize: "0.95rem", maxWidth: "400px", margin: "0.5rem auto 0" }}>
                    The AI couldn't generate suggestions for this particular question.
                  </p>
                </div>
              )
            )}
          </section>
        )}

      </main>

      {/* Modals */}
      {modalType === "announcement" && selectedItem && (
        <AnnouncementDetails
          announcement={selectedItem}
          onClose={closeModal}
          refreshData={fetchAnnouncements}
          isTeacher={false}
        />
      )}
      {modalType === "assignment" && selectedItem &&
        <AssignmentDetails
          assignment={selectedItem}
          onClose={closeModal}
          refreshData={fetchAssignments}
          isTeacher={false}
          testCases={testCases}
          handleFileChange={handleFileChange}
          handleSubmitFile={handleSubmitFile}
          submittedFiles={submittedFiles}
          uploading={uploading}
          output={output}
        />
      }
      {/* ✅ MATERIAL MODAL */}
      {modalType === "material" && selectedItem && (
        <MaterialDetails
          material={selectedItem}
          onClose={closeModal}
          refreshData={fetchMaterials}
          isTeacher={false}
        />
      )}

      {/* ✅ ACTIVITY MODAL */}
      {modalType === "activity" && selectedItem && (
        <ActivityDetails
          activity={selectedItem}
          onClose={closeModal}
          refreshData={fetchActivities}
          isTeacher={false}
        />
      )}

    </div>
  );
}
/** Styles */
const containerStyle = { fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "1rem" };
const headerStyle = { background: "#38b2ac", color: "white", padding: "2rem", textAlign: "center", borderRadius: "8px" };
const navContainerStyle = { display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" };
const navButtonStyle = { padding: "0.8rem 2rem", color: "white", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" };
const sectionStyle = { backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem" };
const sectionTitleStyle = { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }; // ✅ FIXED MISSING STYLE


const commonCardStyle = {
  backgroundColor: "#f9f9f9",
  padding: "1rem",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  cursor: "pointer",
  transition: "background 0.3s",
  border: "1px solid #ddd",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const commonHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  width: "100%",
};

const commonIconStyle = {
  width: "40px",
  height: "40px",
  backgroundColor: "#4299e1",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
};

const commonTitleStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "2px",
};

const commonDateStyle = {
  fontSize: "0.9rem",
  color: "#777",
};

const commonSectionStyle = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginTop: "2rem",
};
const headerContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px", // Space between icon and text
  marginBottom: "1rem",
};
const toggleButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  marginLeft: "auto",
};

const editButtonStyle = {
  backgroundColor: "#facc15",
  color: "#333",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};

const saveButtonStyle = {
  backgroundColor: "#38a169",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};

const cancelButtonStyle = {
  backgroundColor: "#e53e3e",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};