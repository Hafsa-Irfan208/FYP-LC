import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Handle GET request: Fetch test cases for a given assignment
export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const assignmentId = url.searchParams.get("assignmentId");

    if (!assignmentId) {
      return new Response(JSON.stringify({ error: "assignmentId is required" }), { status: 400 });
    }

    // ✅ Fetch test cases from the database
    const testCases = await prisma.testCase.findMany({
      where: { assignmentId: Number(assignmentId) },
      select: {
        id: true,
        assignmentId: true,
        questionNumber: true,
        input: true,
        expectedOutput: true,
      },
    });

    if (testCases.length === 0) {
      console.warn(`⚠️ No test cases found for assignmentId ${assignmentId}`);
    }

    return new Response(JSON.stringify({ testCases }), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching test cases:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

// ✅ Handle POST request: Save new test cases
export const POST = async (req) => {
  try {
    const { assignmentId, testCases } = await req.json();

    if (!assignmentId || !testCases || testCases.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing assignmentId or testCases" }),
        { status: 400 }
      );
    }

    // ✅ Validate test case structure
    const formattedTestCases = testCases.map((tc) => ({
      assignmentId: Number(assignmentId), // Ensure it's a number
      questionNumber: Number(tc.questionNumber), // Ensure it's a number
      input: tc.input.trim(), // ✅ Ensure it's a valid string
      expectedOutput: tc.expectedOutput.trim(), // ✅ Ensure it's a valid string
    }));

    console.log("📌 Storing test cases:", formattedTestCases);

    // ✅ Store test cases in the database
    await prisma.testCase.createMany({
      data: formattedTestCases,
    });

    return new Response(
      JSON.stringify({ message: "✅ Test cases saved successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error saving test cases:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
