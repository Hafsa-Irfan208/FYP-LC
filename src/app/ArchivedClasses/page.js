"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ArchivedClasses = ({ archivedClasses, onRestore }) => {
  const router = useRouter();

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
              {/* ✅ Class Details */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {cls.name || "No Name"} ({cls.classCode || "N/A"})
                </h2>
                <p className="text-sm text-gray-500">
                  {cls.subject || "No Subject"} - Section: {cls.section || "N/A"} - Room: {cls.room || "N/A"}
                </p>
              </div>

              {/* ✅ Actions */}
              <div className="flex gap-2">
                {/* ✅ Go to Class Button */}
                <button
                  className="view-class-btn bg-teal-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600 transition-all"
                  onClick={() => router.push(`/TeacherStream?courseId=${cls.id}`)}
                >
                  Go to Class
                </button>

                {/* ✅ Restore Button */}
                <button
                  className="restore-btn bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 transition-all"
                  onClick={() => onRestore(cls.id)}
                >
                  Restore
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

export default ArchivedClasses;
