import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { classCode, studentId } = await req.json();

    // Find the class by its class code
    const foundClass = await prisma.class.findUnique({
      where: { classCode },
    });

    if (!foundClass) {
      return new Response(JSON.stringify({ message: 'Invalid class code' }), {
        status: 404,
      });
    }

    // Check if the student is already enrolled in this class
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { classId: foundClass.id, studentId },
    });

    if (existingEnrollment) {
      return new Response(
        JSON.stringify({ message: 'You are already enrolled in this class' }),
        { status: 400 }
      );
    }

    // Enroll the student in the class
    const enrollment = await prisma.enrollment.create({
      data: {
        classId: foundClass.id,
        studentId,
      },
    });

    return new Response(JSON.stringify({ message: 'Enrolled successfully', enrollment }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
