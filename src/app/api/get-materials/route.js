import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("courseId");

    if (!classId) {
      return new Response(JSON.stringify({ message: "Class ID is required" }), { status: 400 });
    }

    // ✅ Fetch materials related to the course
    const materials = await prisma.material.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    // ✅ Fetch stream items for materials (ensuring real-time updates)
    const streamItems = await prisma.stream.findMany({
      where: { classId: parseInt(classId), type: "MATERIAL" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify({ materials, streamItems }), { status: 200 });
  } catch (error) {
    console.error("❌ Error occurred while fetching materials:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch materials" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
