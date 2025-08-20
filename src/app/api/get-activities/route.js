import { PrismaClient } from "@prisma/client"; 

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("courseId");

    if (!classId) {
      return new Response(JSON.stringify({ message: 'Class ID is required' }), { status: 400 });
    }

    // Fetch activities related to the course
    const activities = await prisma.activity.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    });

    // Fetch stream items for activities (ensuring real-time updates)
    const streamItems = await prisma.stream.findMany({
      where: { classId: parseInt(classId), type: "ACTIVITY" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify({ activities, streamItems }), { status: 200 });
  } catch (error) {
    console.error("❌ Error occurred while fetching activities:", error);
    return new Response(JSON.stringify({ message: 'Failed to fetch activities' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
