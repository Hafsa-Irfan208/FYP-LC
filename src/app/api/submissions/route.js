// /app/api/submission/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
  
    const body = await req.json(); // Ensure the request body is captured once
    console.log("Request body:", body);

    if (!body) {
      return new Response(JSON.stringify({ message: "Empty request body" }), { status: 400 });
    }

    const { studentId, assignmentId, fileUrl, sourceCode, questionNumber } = body;


    // Validate the required fields
    if (!studentId || !assignmentId || !fileUrl || !sourceCode || !questionNumber) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Get the current timestamp for 'submittedAt'
    const submittedAt = new Date().toISOString();

    // Create the submission record in the database
    // const submissionData = {
    //   studentId: 3,
    //   assignmentId: assignmentId,
    //   //submittedAt: new Date(),
    //   fileUrl: "https://example.com/file3.pdf",
    //   questionNumber: questionNumber,
    //   sorcecode: "System.out.println('Java here!');",
    // };

    const submissionData = {
      studentId: studentId,
      assignmentId: assignmentId,
      fileUrl: fileUrl,
      questionNumber: questionNumber,
      sourcecode: sourceCode,
    }

    console.log("Data being sent to Prisma:", submissionData);

    // Create the submission record
    const submission = await prisma.submission.create({
      data: submissionData,
    });

    // Return the success response with the created submission data
    return new Response(
      JSON.stringify({ message: "Submission created", submission }),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating submission:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create submission" }),
      { status: 500 }
    );
  }
}