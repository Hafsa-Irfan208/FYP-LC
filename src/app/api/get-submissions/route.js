import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Extract assignmentId from query parameters
    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");

    // Validate input
    if (!assignmentId) {
      return new Response(
        JSON.stringify({ message: "Missing assignmentId" }),
        { status: 400 }
      );
    }

   // Inside your findMany call
const submissions = await prisma.submission.findMany({
  where: { assignmentId: parseInt(assignmentId) },
  include: {
    student: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
      },
    },
    assignment: {
      select: {
        title: true,
      },
    },
  },
  orderBy: {
    studentId: 'asc', // optional: to keep ordering stable
  }
});


    return new Response(JSON.stringify(submissions), { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch submissions" }),
      { status: 500 }
    );
  }
}