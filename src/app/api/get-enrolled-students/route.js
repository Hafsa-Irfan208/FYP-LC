import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    console.log("Received courseId:", courseId); // Debugging Log

    if (!courseId) {
      return new Response(JSON.stringify({ error: 'Missing courseId parameter' }), {
        status: 400,
      });
    }

    const enrolledStudents = await prisma.enrollment.findMany({
      where: { classId: Number(courseId) },
      include: { student: true }, // Ensure we fetch student details
    });

    console.log("Fetched enrolled students:", enrolledStudents); // Debugging Log

    if (!enrolledStudents || enrolledStudents.length === 0) {
      return new Response(JSON.stringify({ message: "No students enrolled" }), { status: 200 });
    }

    return new Response(JSON.stringify(enrolledStudents), { status: 200 });

  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
