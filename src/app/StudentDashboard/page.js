'use client';

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faFolder,
  faChartBar,
  faComments,
  faSignOutAlt,
  faChevronDown,
  faChevronRight,
  faArchive,
  faCog,
  faEnvelope,
  faGraduationCap,
  faUserGraduate,
  faEllipsisV,
  faBookOpen
} from "@fortawesome/free-solid-svg-icons";

import EnrollClass from "../EnrollClass/page";
import ViewGrades from "../ViewGrades/page";
import Classwork from "../Classwork/page";
import ViewAssignment from "../ViewAssignment/page";
import ViewQuizAssignment from "../ViewQuizAssignment/page";
import Forum from "../Forum/page";
import Settings from "../Settings/page";
import StudentArchivedClasses from "../StudentArchivedClasses/page"; 
import StudentMessages from "../StudentMessages/page";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [assignmentsExpanded, setAssignmentsExpanded] = useState(false);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [archivedClasses, setArchivedClasses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [classes, setClasses] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);  

  useEffect(() => {
    if (!session) return;

    const fetchEnrolledClasses = async () => {
      try {
        const response = await fetch(
          `/api/enrolled-classes?studentId=${session.user.id}`
        );
        const classes = await response.json();
        setEnrolledClasses(classes.map((e) => e.class));
      } catch (err) {
        console.error("Failed to fetch enrolled classes:", err);
      }
    };

    fetchEnrolledClasses();
  }, [session]);
  
  useEffect(() => {
    if (!session) return;
  
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          console.error("Failed to fetch user data");
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleEnrollClick = () => {
    setShowEnrollModal(true);
  };

  const handleCloseModal = () => {
    setShowEnrollModal(false);
  };

  // Unenroll from a class
  const handleUnenroll = async (classId) => {
    try {
      const response = await fetch(`/api/unenroll-class`, {
        method: 'DELETE', // DELETE method for unenroll
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: classId,
          studentId: session.user.id, // Passing studentId from session
        }),
      });

      if (response.ok) {
        // Remove the class from the enrolledClasses state after successful unenrollment
        setEnrolledClasses(enrolledClasses.filter((cls) => cls.id !== classId));
      } else {
        const data = await response.json();
        console.error('Unenrollment failed:', data.message);
        alert('Failed to unenroll from class. Please try again later.');
      }
    } catch (error) {
      console.error("Error unenrolling:", error);
      alert('An error occurred while unenrolling. Please try again later.');
    }
  };
  
  const handleArchive = (classId) => {
    const classToArchive = enrolledClasses.find((cls) => cls.id === classId);
    
    if (!classToArchive) return;
  
    const updatedEnrolledClasses = enrolledClasses.filter((cls) => cls.id !== classId);
    const updatedArchivedClasses = [...archivedClasses, classToArchive];
  
    setEnrolledClasses(updatedEnrolledClasses);
    setArchivedClasses(updatedArchivedClasses);
  
    localStorage.setItem("archivedClasses", JSON.stringify(updatedArchivedClasses));
    localStorage.setItem("enrolledClasses", JSON.stringify(updatedEnrolledClasses));
  
    setDropdownOpen(null);
  };
  
  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-teal-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <img src="/logo.png" alt="LeetConnect Logo" className="w-32 h-auto mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Required</h2>
            <p className="text-gray-600 mb-6">You need to log in to access this dashboard.</p>
            <button 
              onClick={() => router.push("/")}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-600 transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with enhanced styling */}
      <aside className="w-72 bg-gradient-to-b from-white to-gray-50 shadow-xl z-10 transition-all duration-300">
        <div className="h-full flex flex-col">
          {/* Logo and Profile Section with improved styling */}
          <div className="p-6 border-b border-gray-100 flex flex-col items-center">
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="LeetConnect Logo"
                className="w-56 h-auto"
              />
            </div>
            <div className="flex flex-col items-center pt-4">
              {user?.profilePicture ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 p-1 shadow-lg">
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white">
                    <div className="h-3 w-3 rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 p-1 shadow-lg">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-teal-500">
                      <FontAwesomeIcon icon={faUserGraduate} className="text-3xl" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white">
                    <div className="h-3 w-3 rounded-full"></div>
                  </div>
                </div>
              )}
              <h2 className="text-gray-900 text-xl font-bold mt-4">
                {session?.user?.name}
              </h2>
              <span className="bg-teal-50 text-teal-600 rounded-full px-3 py-1 text-xs font-medium mt-1">
                Student
              </span>
            </div>
          </div>

          {/* Navigation Menu with improved styling */}
          <nav className="flex-grow p-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === "dashboard"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faHome} className={`w-5 h-5 mr-3 ${currentView === "dashboard" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("messages")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === "messages"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faEnvelope} className={`w-5 h-5 mr-3 ${currentView === "messages" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Messages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("forum")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === "forum"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faComments} className={`w-5 h-5 mr-3 ${currentView === "forum" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Forum</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("archived")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === "archived"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faArchive} className={`w-5 h-5 mr-3 ${currentView === "archived" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Archived Classes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("settings")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === "settings"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faCog} className={`w-5 h-5 mr-3 ${currentView === "settings" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Settings</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Sign Out Button with improved styling */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="p-8">
          {/* Dashboard Content */}
          {currentView === "dashboard" && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-1.5 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-full"></div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      My Classes
                    </h1>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="bg-teal-50 text-teal-600 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="mr-2 h-3.5 w-3.5" />
                      {enrolledClasses.length} {enrolledClasses.length === 1 ? "class" : "classes"}
                    </span>
                    <p className="text-gray-600">
                      Manage your enrolled classes and learning materials
                    </p>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center group"
                  onClick={handleEnrollClick}
                >
                  <div className="bg-white bg-opacity-20 rounded-full p-1 mr-2 group-hover:bg-opacity-30 transition-all">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Enroll in Class</span>
                </button>
              </div>

              {/* Active Classes with improved styling */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-emerald-50 rounded-full -mb-6 mr-10 z-0"></div>
                <div className="flex items-center relative z-10">
                  <div className="bg-gradient-to-r from-teal-400 to-emerald-500 p-3 rounded-lg mr-4 shadow-sm">
                    <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Enrolled Classes</h3>
                    <p className="text-sm text-gray-500">Your currently active learning classes</p>
                  </div>
                  <div className="ml-auto bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-xl font-bold text-white">{enrolledClasses.length}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                {enrolledClasses.length > 0 ? (
                  enrolledClasses.map((cls, index) => {
                    // Define border colors without background gradients
                    const borderColors = [
                      'border-l-teal-500',
                      'border-l-purple-500',
                      'border-l-amber-500',
                      'border-l-rose-500',
                      'border-l-emerald-500'
                    ];
                    const borderColor = borderColors[index % borderColors.length];
                    
                    return (
                      <div
                        key={cls.id}
                        className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 ${borderColor} group overflow-hidden relative`}
                      >
                        {/* Decorative elements */}
                        <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-gray-50 bg-opacity-50 rounded-full"></div>
                        <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-gray-50 bg-opacity-70 rounded-full"></div>
                        
                        <div className="flex justify-between items-center relative">
                          <div>
                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors flex items-center">
                              <span className="mr-2">{cls.name}</span>
                              {cls.subject && (
                                <span className="bg-white text-xs font-medium px-2 py-1 rounded-full border border-gray-200 text-gray-500">
                                  {cls.subject}
                                </span>
                              )}
                            </h2>
                            <div className="flex flex-wrap items-center mt-3 gap-2">
                              <span className="bg-teal-50 bg-opacity-80 text-teal-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-100">
                                Code: {cls.classCode}
                              </span>
                              {cls.section && (
                                <span className="bg-gray-50 bg-opacity-80 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                                  Section: {cls.section}
                                </span>
                              )}
                              {cls.room && (
                                <span className="bg-gray-50 bg-opacity-80 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                                  Room: {cls.room}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-teal-500 hover:text-white transition-all border border-teal-100 shadow-sm"
                              onClick={() => router.push(`/StudentStream?courseId=${cls.id}`)}
                            >
                              Go to Class
                            </button>

                            <div className="relative">
                              <button
                                className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors shadow-sm"
                                onClick={() => setDropdownOpen(dropdownOpen === cls.id ? null : cls.id)}
                              >
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </button>

                              {dropdownOpen === cls.id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10 animate-fadeIn">
                                  <button
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    onClick={() => handleArchive(cls.id)}
                                  >
                                    <FontAwesomeIcon icon={faArchive} className="mr-2 text-gray-500" />
                                    Archive Class
                                  </button>
                                  <button
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={() => handleUnenroll(cls.id)}
                                  >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-500" />
                                    Unenroll
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="bg-teal-50 inline-flex p-4 rounded-full mb-4">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-teal-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Classes Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Enroll in your first class to start learning.
                    </p>
                    <button
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      onClick={handleEnrollClick}
                    >
                      Enroll in Your First Class
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          {currentView === "messages" && (
            <div className="animate-fadeIn">
              <StudentMessages />
            </div>
          )}

          {/* Forum */}
          {currentView === "forum" && (
            <div className="animate-fadeIn">
              <Forum studentName={session?.user?.name} />
            </div>
          )}

          {/* Archived Classes */}
          {currentView === "archived" && (
            <div className="animate-fadeIn">
              <StudentArchivedClasses />
            </div>
          )}

          {/* Settings */}
          {currentView === "settings" && (
            <div className="animate-fadeIn">
              <Settings onProfilePictureChange={(updatedPicture) => setUser(prev => ({ ...prev, profilePicture: updatedPicture }))} />
            </div>
          )}
        </div>
      </main>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Enroll in Class</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <EnrollClass onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}
