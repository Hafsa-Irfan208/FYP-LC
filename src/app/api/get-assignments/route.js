import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("courseId");

    if (!classId) {
      return new Response(JSON.stringify({ message: 'Class ID is required' }), { status: 400 });
    }

    // Fetch assignments related to the course
    const assignments = await prisma.assignment.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { dueDate: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    // Fetch stream items for assignments (ensuring real-time updates)
    const streamItems = await prisma.stream.findMany({
      where: { classId: parseInt(classId), type: "assignment" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify({ assignments, streamItems }), { status: 200 });
  } catch (error) {
    console.error("Error occurred while fetching assignments:", error);
    return new Response(JSON.stringify({ message: 'Failed to fetch assignments' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
