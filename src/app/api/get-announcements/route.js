import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return new Response(JSON.stringify({ message: "Course ID is required." }), { status: 400 });
    }

    const announcements = await prisma.announcement.findMany({
      where: { classId: parseInt(courseId) }, // Use courseId instead of classId
      orderBy: { createdAt: "desc" }, // Latest first
      select: {
        id: true,
        text: true,
        createdAt: true,
        classId: true,
        class: {
          select: { name: true, section: true }, // Optional class details
        },
      },
    });

    return new Response(JSON.stringify(announcements), { status: 200 });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
