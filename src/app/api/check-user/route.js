import { PrismaClient } from "@prisma/client";  // ✅ Import Prisma (or your ORM)
const db = new PrismaClient();  // ✅ Initialize database

export async function POST(req) {
  try {
    const { email } = await req.json();  // ✅ Parse the JSON request body

    // ✅ Convert email to lowercase to ensure case-insensitive match
    const teacher = await db.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role: "teacher", // Ensure it's a teacher
      },
    });

    if (!teacher) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        exists: true,
        teacherId: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        role: teacher.role,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
