import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return new Response(JSON.stringify({ message: "Class ID is required" }), { status: 400 });
    }

    // Fetch Assignments
    const assignments = await prisma.assignment.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true, // File stored on S3
        dueDate: true,
        createdAt: true,
      },
    });

    // Fetch Announcements
    const announcements = await prisma.announcement.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, message: true, createdAt: true },
    });

    // Fetch Materials
    const materials = await prisma.material.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, fileUrl: true, createdAt: true },
    });

    // If nothing is found, return an empty array instead of a 404 error
    if (!assignments.length && !announcements.length && !materials.length) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Merge all items into one stream and sort them by date
    const streamData = [
      ...assignments.map((a) => ({
        id: a.id,
        type: "assignment",
        title: `📄 ${a.title}`,
        description: a.description,
        fileUrl: a.fileUrl,
        dueDate: a.dueDate,
        createdAt: a.createdAt,
      })),
      ...announcements.map((a) => ({
        id: a.id,
        type: "announcement",
        title: `📢 ${a.title}`,
        description: a.message,
        createdAt: a.createdAt,
      })),
      ...materials.map((m) => ({
        id: m.id,
        type: "material",
        title: `📂 ${m.title}`,
        fileUrl: m.fileUrl,
        createdAt: m.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify(streamData), { status: 200 });
  } catch (error) {
    console.error("Error fetching stream:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch stream" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
