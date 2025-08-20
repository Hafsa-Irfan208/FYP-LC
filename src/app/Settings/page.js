"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

export default function Settings() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    profilePicture: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user data when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      const fetchUser = async () => {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            age: data.age || "",
            gender: data.gender || "",
            profilePicture: data.profilePicture || null,
          });
        }
      };

      fetchUser();
    }
  }, [status]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      setFormData((prev) => ({ ...prev, profilePicture: imageData }));

      // Store Profile Picture in localStorage
      localStorage.setItem("profilePicture", imageData);

      // Dispatch Event to Notify Student Dashboard
      window.dispatchEvent(new Event("profilePictureUpdated"));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    setIsSubmitting(true);

    try {
      const validData = {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        age: formData.age || "0",
        gender: formData.gender || "",
        profilePicture: formData.profilePicture || null,
      };

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert("Settings updated successfully!");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("An error occurred while updating settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setDropdownOpen(true);
  };

  const handleRemoveProfilePicture = async () => {
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    setDropdownOpen(false);

    try {
      await fetch("/api/user/remove-profile-picture", { method: "POST" });
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You need to sign in to view this page.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Settings</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6 relative">
          {formData.profilePicture ? (
            <img
              src={formData.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-2 cursor-pointer shadow-md"
              onContextMenu={handleRightClick}
            />
          ) : (
            <div
              className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2 shadow-md cursor-pointer"
              onContextMenu={handleRightClick}
            >
              No Image
            </div>
          )}

          {/* Dropdown Menu for Removing Profile Picture */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-28 right-0 bg-white shadow-md rounded-md w-40 border"
            >
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                onClick={handleRemoveProfilePicture}
              >
                Remove Profile Picture
              </button>
            </div>
          )}

          {/* Upload Profile Picture Button */}
          <label
            htmlFor="profilePictureUpload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 mt-2"
          >
            Upload
          </label>
          <input
            type="file"
            id="profilePictureUpload"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureUpload}
          />
        </div>

        {/* User Information Form */}
        <div className="flex flex-col gap-4 mb-4">
  <div>
    <label className="block text-gray-700 font-medium mb-1">First Name</label>
    <input
      type="text"
      name="firstName"
      value={formData.firstName}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Last Name</label>
    <input
      type="text"
      name="lastName"
      value={formData.lastName}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Age</label>
    <input
      type="number"
      name="age"
      value={formData.age}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Gender</label>
    <select
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>
</div>


        {/* Save Button */}
        <button onClick={handleSaveSettings} className="w-40 bg-green-500 text-white py-2 text-sm rounded-md hover:bg-green-600">
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
       
      </div>
    </div>
  );
}
