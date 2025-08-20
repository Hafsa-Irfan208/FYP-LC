import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // ✅ Fetch grades from the AssignmentResult table
    const grades = await prisma.assignmentResult.findMany({
      select: {
        studentId: true,
        assignmentId: true,
        score: true,
        grade: true,
        student: {
          select: { firstName: true, lastName: true }, // ✅ Get student name
        },
        assignment: {
          select: { title: true }, // ✅ Get assignment title
        },
      },
    });

    return new Response(JSON.stringify(grades), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching grades:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
