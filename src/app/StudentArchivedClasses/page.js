"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const StudentArchivedClasses = () => {
  const [archivedClasses, setArchivedClasses] = useState([]);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchArchivedClasses = () => {
      const storedArchivedClasses = JSON.parse(localStorage.getItem("archivedClasses")) || [];
      setArchivedClasses(storedArchivedClasses);
    };

    // Fetch archived classes on mount
    fetchArchivedClasses();

    // Sync with localStorage updates (when teacher archives a class)
    const handleStorageChange = () => {
      fetchArchivedClasses();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to navigate to StudentStream **without restoring**
  const handleViewClass = (classId) => {
    router.push(`/StudentStream?courseId=${classId}`); // Only navigate
  };

  return (
    <div className="archived-classes p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-600 mb-8">Archived Classes</h1>
      <section className="courses-list grid gap-4">
        {archivedClasses.length > 0 ? (
          archivedClasses.map((cls) => (
            <div
              key={cls.id}
              className="course-card p-4 bg-white rounded-md shadow-md flex justify-between items-center hover:shadow-lg transition-shadow"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">{cls.name || "No Name"}</h2>
                <p className="text-sm text-gray-500">{cls.subject || "No Subject"}</p>
              </div>
              <div className="flex gap-2">
                {/* View Class - Only Navigate (Does Not Restore) */}
                <button
                  className="view-class-btn bg-teal-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600 transition-all"
                  onClick={() => handleViewClass(cls.id)}
                >
                  View Class
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No archived classes available.</p>
        )}
      </section>
    </div>
  );
};

export default StudentArchivedClasses;
