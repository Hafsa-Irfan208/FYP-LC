import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Parse URL parameters
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const courseId = searchParams.get("courseId");

    if (courseId) {
      // Fetch specific class by courseId with Teacher Name
      const course = await prisma.class.findUnique({
        where: { id: parseInt(courseId) },
        include: {
          teacher: { select: { id: true, firstName: true, lastName: true } }, // ✅ Fetch Teacher Name
          announcements: true, 
          activities: true, 
          enrollments: {
            include: { student: { select: { id: true, firstName: true, lastName: true, email: true } } }, 
          },
        },
      });

      if (!course) {
        console.log("Class not found for courseId:", courseId);
        return new Response(JSON.stringify({ message: "Class not found" }), { status: 404 });
      }

      // ✅ Modify response to include teacherName
      const response = {
        ...course,
        teacherName: course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : "Unknown Teacher",
      };

      return new Response(JSON.stringify(response), { status: 200 });
    }

    if (!teacherId) {
      return new Response(
        JSON.stringify({ message: "Teacher ID is required" }),
        { status: 400 }
      );
    }

    const classes = await prisma.class.findMany({
      where: { teacherId: parseInt(teacherId) },
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { firstName: true, lastName: true } }, // ✅ Fetch Teacher Name in classes list
      },
    });

    return new Response(
      JSON.stringify({ 
        classes: classes.map((cls) => ({
          ...cls,
          teacherName: cls.teacher ? `${cls.teacher.firstName} ${cls.teacher.lastName}` : "Unknown Teacher",
        }))
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("❌ API Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch classes" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
