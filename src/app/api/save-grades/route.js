import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // ✅ Read request body as text and parse JSON
    const bodyText = await req.text();
    console.log("📝 Raw request body:", bodyText);
    const body = JSON.parse(bodyText);
    console.log("✅ Parsed body:", body);

    // ✅ Extract values
    let { studentId, assignmentId, score, grade } = body;

    // ✅ Validate required fields
    if (!studentId || !assignmentId || score === undefined || !grade) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // ✅ Convert assignmentId to integer (fixing any string issue)
    assignmentId = parseInt(assignmentId, 10);
    if (isNaN(assignmentId)) {
      return new Response(JSON.stringify({ error: "Invalid assignmentId" }), { status: 400 });
    }

    // ✅ Check if a grade entry already exists
    const existingResult = await prisma.assignmentResult.findUnique({
      where: {
        studentId_assignmentId: { studentId, assignmentId }, // Uses @@unique([studentId, assignmentId])
      },
    });

    let savedGrade;
    if (existingResult) {
      // ✅ Update existing result
      savedGrade = await prisma.assignmentResult.update({
        where: {
          studentId_assignmentId: { studentId, assignmentId },
        },
        data: { score, grade },
      });
      console.log("✅ Grade updated:", savedGrade);
    } else {
      // ✅ Create new result
      savedGrade = await prisma.assignmentResult.create({
        data: { studentId, assignmentId, score, grade },
      });
      console.log("✅ Grade saved successfully:", savedGrade);
    }

    return new Response(JSON.stringify({ result: savedGrade }), { status: 200 });
  } catch (error) {
    console.error("❌ Error saving grades:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
  }
}
