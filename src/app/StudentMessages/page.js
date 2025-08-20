"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const StudentMessages = () => {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [showInput, setShowInput] = useState(false);
  const messagesEndRef = useRef(null); // Auto-scroll to latest message

  // Fetch conversations on component load
  useEffect(() => {
    if (!session) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/get-messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();

        // ✅ Ensure unique conversations & correct data
        const uniqueConversations = Array.from(
          new Map(data.messages.map((msg) => [msg.receiver.id, msg.receiver])).values()
        );

        setConversations(uniqueConversations);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, [session]);

  // Fetch full chat history when selecting a conversation
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
  
    const payload = {
      senderId: session?.user?.id,
      receiverId: conversation?.id,
    };
  
    console.log("📩 Fetching chat history with payload:", payload);
  
    try {
      const res = await fetch("/api/get-chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! Status: ${res.status} - ${errorText}`);
      }
  
      const data = await res.json();
      console.log("✅ Chat history received:", data);
  
      setSelectedConversation((prev) => ({
        ...prev,
        messages: data?.messages || [],
      }));
    } catch (error) {
      console.error("❌ Failed to fetch chat history:", error);
    }
  };
  
  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation]);

  const handleStartConversation = async () => {
    try {
      const checkRes = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: teacherEmail }),
      });

      const checkData = await checkRes.json();
      if (!checkData.exists || checkData.role !== "teacher") {
        alert("Teacher not found!");
        return;
      }

      setSelectedConversation({
        id: checkData.teacherId,
        email: teacherEmail,
        firstName: checkData.firstName,
        lastName: checkData.lastName,
        messages: [],
      });

      setShowInput(false);
    } catch (error) {
      console.error("Error checking teacher:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) {
      alert("Please select a teacher and enter a message.");
      return;
    }

    try {
      const sendRes = await fetch("/api/send-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session.user.id,
          receiverEmail: selectedConversation.email,
          message: newMessage,
        }),
      });

      if (sendRes.ok) {
        const sentMessage = await sendRes.json();

        // ✅ Update Conversations List Properly
        setConversations((prev) => {
          const updatedConversations = [...prev];

          // Check if conversation already exists
          const existingConv = updatedConversations.find(
            (conv) => conv.id === selectedConversation.id
          );

          if (!existingConv) {
            updatedConversations.push({
              id: selectedConversation.id,
              email: selectedConversation.email,
              firstName: selectedConversation.firstName || "Unknown",
              lastName: selectedConversation.lastName || "",
            });
          }

          return updatedConversations;
        });

        // ✅ Update Chat Messages Instantly
        setSelectedConversation((prevConv) => ({
          ...prevConv,
          messages: [...(prevConv.messages || []), { senderId: session.user.id, content: newMessage }],
        }));

        setNewMessage("");
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for Conversations */}
      <div className="w-1/3 bg-white p-4 shadow-md border-r">
        <button
          onClick={() => setShowInput(true)}
          className="bg-blue-500 text-white p-3 rounded-md w-full mb-4"
        >
          Start Conversation
        </button>

        {showInput && (
          <div className="mt-2">
            <input
              type="email"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              className="border p-3 w-full rounded-md"
              placeholder="Enter teacher's email"
            />
            <button
              onClick={handleStartConversation}
              className="bg-green-500 text-white p-3 rounded-md mt-2 w-full"
            >
              Start
            </button>
          </div>
        )}

        {/* Conversations List */}
        <ul className="mt-4">
          {conversations.map((conv, index) => (
            <li
              key={`${conv.id}-${index}`}
              className="p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300 flex items-center gap-3 mb-2"
              onClick={() => handleSelectConversation(conv)}
            >
              {/* Display user profile icon with first letter */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                {conv.firstName ? conv.firstName[0] : "?"}
              </div>
              <span className="text-lg font-medium">
                {conv.firstName || "Unknown"} {conv.lastName || ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 p-6">
        {selectedConversation ? (
          <>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Chat with {selectedConversation.firstName} {selectedConversation.lastName}
            </h2>

            <div className="bg-white p-4 rounded-md shadow-md h-[60vh] overflow-y-auto">
              {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((msg, index) => (
                  <p
                    key={index}
                    className={`p-3 my-2 rounded-md max-w-xs ${
                      msg.senderId === session.user.id
                        ? "bg-teal-500 text-white self-end ml-auto"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {msg.content}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 text-center">No messages yet</p>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Send Message */}
            <div className="flex items-center mt-4">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-grow p-3 border rounded-md" placeholder="Type a message..." />
              <button onClick={handleSendMessage} className="ml-2 bg-teal-500 text-white p-3 rounded-md">
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Select a conversation to start messaging</p>
        )}
      </div>
    </div>
  );
};

export default StudentMessages;
