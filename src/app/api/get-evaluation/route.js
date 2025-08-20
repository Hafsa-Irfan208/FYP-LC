import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = parseInt(searchParams.get("studentId"), 10);

    if (!studentId) {
      return new Response(JSON.stringify({ error: "Missing studentId" }), { status: 400 });
    }

    console.log("Fetching evaluations for studentId:", studentId);

    const evaluations = await prisma.evaluation.findMany({
      where: { studentId },
      
    });

    console.log("✅ Evaluations found:", evaluations);

    if (!evaluations.length) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // ✅ Ensure results are returned as an array
    return new Response(JSON.stringify(evaluations), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error("❌ Error fetching evaluations:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
  }
}