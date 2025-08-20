import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  try {
    const enrolledClasses = await prisma.enrollment.findMany({
      where: { studentId: parseInt(studentId) },
      include: { class: true },
    });

    return new Response(JSON.stringify(enrolledClasses), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
