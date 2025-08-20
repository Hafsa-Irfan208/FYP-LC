import { PrismaClient } from '@prisma/client';
import axios from 'axios'; // Ensure axios is imported
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ✅ Gemini API (RapidAPI) config
const API_URL = 'https://gemini-1-5-flash.p.rapidapi.com/v1/chat/completions'; // Gemini API URL
const API_HOST = 'gemini-1-5-flash.p.rapidapi.com'; // Host for Gemini API

export async function POST(req) {
  try {
    const body = await req.json();
    const { assignmentId, questionNumber, studentId } = body;

  if (!assignmentId || !questionNumber || !studentId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Fetch the submission from your DB
    const submission = await prisma.submission.findFirst({
      where: {
        assignmentId,
        questionNumber,
        studentId,
      },
    });

    if (!submission || !submission.sourcecode) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const { sourcecode } = submission;

    // Create a prompt for Gemini to analyze the code
    const prompt = `
    You are an expert programming assistant.
    Here is a student's source code submission. Provide:
   
    - Any bugs or improvements in 25 words
    - Suggestions for better structure or performance in 50 words
                                                                                                            
    Code:
    ${sourcecode}
    `.trim();

    const options = {
      method: 'POST',
      url: 'https://gemini-1-5-flash.p.rapidapi.com/',
      headers: {
        'x-rapidapi-key': '62844297efmshc14f054e979e14ep17697djsn80c3172ad69f',
        'x-rapidapi-host': 'gemini-1-5-flash.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        model: 'gemini-1.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    };

    // Send the request to Gemini's API
    const response = await axios.request(options);

    // Gemini response contains suggestions
    const geminiSuggestion = response.data.choices[0].message.content.trim();

    return new Response(JSON.stringify({suggestion: geminiSuggestion}), { status: 200 });
  
  } catch (err) {
    console.error('Error during Gemini API request:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
  catch (error) { 
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}