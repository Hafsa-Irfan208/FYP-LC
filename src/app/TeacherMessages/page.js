"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const TeacherMessages = () => {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/get-messages", {
          method: "POST",
          body: JSON.stringify({ userId: session.user.id }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        const uniqueConversations = Array.from(
          new Map(data.messages.map((msg) => [msg.sender.id, msg.sender])).values()
        );

        setConversations(uniqueConversations);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchConversations();
  }, [session]);

  // Fetch chat history when a conversation is selected
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    try {
      const res = await fetch("/api/get-chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session?.user?.id,
          receiverId: conversation?.id,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      setSelectedConversation((prev) => ({
        ...prev,
        messages: data?.messages || [],
      }));
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  // Send a reply
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
  
    try {
      const sendRes = await fetch("/api/send-message", {  // ✅ Correct API Path
        method: "POST",
        body: JSON.stringify({
          senderId: session.user.id,
          receiverEmail: selectedConversation.email, // Ensure this is correct
          message: newMessage,
        }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (sendRes.ok) {
        const sentMessage = await sendRes.json();
  
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
        <h2 className="text-lg font-semibold mb-4">Student Messages</h2>

        <ul className="mt-4">
          {conversations.map((conv, index) => (
            <li
              key={`${conv.id}-${index}`}
              className="p-3 flex items-center gap-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300 mb-2"
              onClick={() => handleSelectConversation(conv)}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                {conv.firstName[0]}
              </div>
              <span className="text-lg font-medium">
                {conv.firstName} {conv.lastName}
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

            <div className="bg-white p-4 rounded-md shadow-md mb-4 h-[60vh] overflow-y-auto">
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

            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow p-3 border rounded-md"
                placeholder="Type a reply..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-teal-500 text-white p-3 rounded-md"
              >
                Reply
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Select a student to start messaging</p>
        )}
      </div>
    </div>
  );
};

export default TeacherMessages;
