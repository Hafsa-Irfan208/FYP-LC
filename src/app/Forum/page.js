"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Forum() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState([]); // ✅ State for questions
  const [newQuestion, setNewQuestion] = useState(""); // ✅ State for new question input

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/forum");

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const textResponse = await res.text(); // Get raw response
      if (!textResponse) {
        console.error("❌ Error: Empty response from server.");
        setQuestions([]); // Set empty questions
        return;
      }

      try {
        const data = JSON.parse(textResponse); // Convert text to JSON
        setQuestions(data);
      } catch (parseError) {
        console.error("❌ Error parsing JSON response:", parseError);
        console.log("Response was:", textResponse);
      }
    } catch (error) {
      console.error("🔥 Error fetching questions:", error);
    }
  };

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
  
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newQuestion, // ✅ Send only the question text
          userId: session?.user?.id, // ✅ User ID is needed
        }),
      });
  
      if (!res.ok) {
        console.error(`❌ API Error: ${res.status} ${res.statusText}`);
        return;
      }
  
      const data = await res.json(); // ✅ Get the response (including new question ID)
      console.log("✅ Question posted successfully:", data);
  
      setNewQuestion(""); // ✅ Reset input field
      fetchQuestions(); // ✅ Refresh forum to include the new question
    } catch (error) {
      console.error("🔥 Error posting question:", error);
    }
  };
  

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Discussion Forum</h2>

      {/* Post a Question */}
      <div className="mb-6">
        <textarea
          placeholder="Ask a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handlePostQuestion}
        >
          Post Question
        </button>
      </div>

      {/* Display Questions */}
      {questions.length === 0 ? (
        <p>No questions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              fetchQuestions={fetchQuestions} // Pass fetch function for updates
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, fetchQuestions }) {
  const { data: session } = useSession();
  const [newReply, setNewReply] = useState(""); // ✅ State for reply input
  const [replies, setReplies] = useState(question.replies || []); // ✅ Initialize with question replies

  const handlePostReply = async (questionId) => {
    if (!newReply.trim()) return;
  
    try {
      const res = await fetch("/api/forum/post-reply", {  // ✅ Ensure correct API path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: questionId,  // ✅ Ensure this matches API expectations
          replyText: newReply,
          userId: session?.user?.id, // ✅ Ensure userId is sent
        }),
      });
  
      if (!res.ok) {
        console.error(`❌ API Error: ${res.status} ${res.statusText}`);
        return;
      }
  
      const data = await res.json(); // ✅ Get response data
      console.log("✅ Reply posted successfully:", data);
  
      setNewReply("");
      fetchQuestions(); // ✅ Refresh replies
    } catch (error) {
      console.error("🔥 Error posting reply:", error);
    }
  };
  

  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="font-bold">
        {question.user?.firstName} {question.user?.lastName}:
      </h3>
      <p className="mb-2">{question.text}</p>

      {/* Replies */}
      {replies.length > 0 && (
        <ul className="pl-4 border-l">
          {replies.map((reply, index) => (
            <li key={index} className="text-gray-600">
              <strong>{reply.user?.firstName} {reply.user?.lastName}:</strong> {reply.text}
            </li>
          ))}
        </ul>
      )}

      {/* Reply Input */}
      <div className="mt-2">
        <textarea
          placeholder="Write a reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <button
  className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
  onClick={() => handlePostReply(question.id)} // ✅ Pass question.id
>
  Post Reply
</button>

      </div>
    </div>
  );
}
