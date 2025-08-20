"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faArchive,
  faCog,
  faEnvelope,
  faSignOutAlt,
  faEllipsisV,
  faGraduationCap,
  faBookOpen,
  faChalkboardTeacher,
  faArchive as faArchiveIcon,
} from "@fortawesome/free-solid-svg-icons";
import CreateClass from "../CreateClass/page";
import ArchivedClasses from "../ArchivedClasses/page";
import Settings from "../Settings/page";
import TeacherMessages from "../TeacherMessages/page";

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [archivedClasses, setArchivedClasses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const fetchClasses = async () => {
      try {
        const response = await fetch(`/api/get-classes?teacherId=${session.user.id}`);
        if (!response.ok) return;
        const data = await response.json();

        const storedArchived = JSON.parse(localStorage.getItem("archivedClasses")) || [];
        const filteredClasses = data.classes.filter(cls => !storedArchived.some(archived => archived.id === cls.id));

        setClasses(filteredClasses);
        setArchivedClasses(storedArchived);
      } catch (error) {
        console.log("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleArchiveClass = (classId) => {
    const classToArchive = classes.find(cls => cls.id === classId);
    if (!classToArchive) return;

    const updatedClasses = classes.filter(cls => cls.id !== classId);
    const updatedArchived = [classToArchive, ...archivedClasses];

    setClasses(updatedClasses);
    setArchivedClasses(updatedArchived);
    setDropdownOpen(null);

    localStorage.setItem("enrolledClasses", JSON.stringify(updatedClasses));
    localStorage.setItem("archivedClasses", JSON.stringify(updatedArchived));

    window.dispatchEvent(new Event("storage"));
  };

  const handleRestoreClass = (classId) => {
    const classToRestore = archivedClasses.find(cls => cls.id === classId);
    if (!classToRestore) return;

    const updatedArchived = archivedClasses.filter(cls => cls.id !== classId);
    const updatedClasses = [...classes, classToRestore];

    setArchivedClasses(updatedArchived);
    setClasses(updatedClasses);

    localStorage.setItem("archivedClasses", JSON.stringify(updatedArchived));
    localStorage.setItem("enrolledClasses", JSON.stringify(updatedClasses));

    window.dispatchEvent(new Event("storage"));
  };

  const handleClassCreated = (newClass) => {
    setClasses(prev => [newClass, ...prev]);
    setModalOpen(false);
  };

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg z-10">
        <div className="h-full flex flex-col">
          {/* Logo and Profile */}
          <div className="p-6 border-b border-gray-100 flex flex-col items-center">
            <div className="mb-6">
              <img src="/logo.png" alt="LeetConnect Logo" className="w-56 h-auto" />
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
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="text-3xl" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white">
                    <div className="h-3 w-3 rounded-full"></div>
                  </div>
                </div>
              )}
              <h2 className="text-gray-900 text-xl font-bold mt-4">{session?.user?.name}</h2>
              <span className="bg-teal-50 text-teal-600 rounded-full px-3 py-1 text-xs font-medium mt-1">Educator</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === "dashboard"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faHome} className={`w-5 h-5 mr-3 ${currentPage === "dashboard" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("archived")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === "archived"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faArchiveIcon} className={`w-5 h-5 mr-3 ${currentPage === "archived" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Archived Classes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("messages")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === "messages"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faEnvelope} className={`w-5 h-5 mr-3 ${currentPage === "messages" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Messages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("settings")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === "settings"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faCog} className={`w-5 h-5 mr-3 ${currentPage === "settings" ? "text-white" : "text-teal-500"}`} />
                  <span className="font-medium">Settings</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Sign Out */}
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
      <main className="flex-grow bg-gray-50 min-h-screen overflow-auto">
        <div className="p-8">
          {/* Dashboard Content */}
          {currentPage === "dashboard" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-1.5 bg-teal-500 rounded-full"></div>
                    <h1 className="text-3xl font-bold text-gray-800">My Classroom</h1>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="bg-teal-50 text-teal-600 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="mr-2 h-3.5 w-3.5" />
                      {classes.length} {classes.length === 1 ? "class" : "classes"}
                    </span>
                    <p className="text-gray-600">Manage your virtual classrooms and educational resources</p>
                  </div>
                </div>

                {/* Create Class Button */}
                <button
                  className="bg-teal-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center gap-2"
                  onClick={() => setModalOpen(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Class
                </button>
              </div>

              {/* Active Classes Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-teal-500 p-3 rounded-lg text-white">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-800">Active Classes</h3>
                    <p className="text-sm text-gray-500">Your currently active teaching classes</p>
                  </div>
                  <div className="ml-auto bg-teal-500 px-4 py-2 rounded-lg text-white">
                    <span className="text-xl font-bold">{classes.length}</span>
                  </div>
                </div>
              </div>

              {/* Classes List */}
              <div className="grid gap-6">
                {classes.length > 0 ? (
                  classes
                    .filter((course) => course)
                    .map((course, index) => (
                      <div
                        key={course.id}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-teal-500"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h2>
                            <div className="flex flex-wrap gap-2">
                              <span className="bg-teal-50 text-teal-600 text-xs font-medium px-2.5 py-1 rounded">
                                Code: {course.classCode}
                              </span>
                              {course.section && (
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded">
                                  Section: {course.section}
                                </span>
                              )}
                              {course.room && (
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded">
                                  Room: {course.room}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              className="text-teal-600 hover:text-teal-700 font-medium"
                              onClick={() => router.push(`/TeacherStream?courseId=${course.id}`)}
                            >
                              Go to Class
                            </button>
                            <div className="dropdown-container relative">
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setDropdownOpen(course.id)}
                              >
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </button>
                              {dropdownOpen === course.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                                  <div className="py-1">
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={() => handleArchiveClass(course.id)}
                                    >
                                      <FontAwesomeIcon icon={faArchive} className="mr-2" />
                                      Archive Class
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-teal-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Classes Yet</h3>
                    <p className="text-gray-600 mb-6">Create your first class to get started with teaching.</p>
                    <button
                      className="bg-teal-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                      onClick={() => setModalOpen(true)}
                    >
                      Create Your First Class
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Archived Classes */}
          {currentPage === "archived" && (
            <div>
              <ArchivedClasses archivedClasses={archivedClasses} onRestore={handleRestoreClass} />
            </div>
          )}

          {/* Messages */}
          {currentPage === "messages" && (
            <div>
              <TeacherMessages />
            </div>
          )}

          {/* Settings */}
          {currentPage === "settings" && (
            <div>
              <Settings onProfilePictureChange={(updatedPicture) => setUser(prev => ({ ...prev, profilePicture: updatedPicture }))} />
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <CreateClass
          teacherId={session.user.id}
          onClassCreated={(newClass) => {
            if (newClass) {
              setClasses(prev => [newClass, ...prev]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
