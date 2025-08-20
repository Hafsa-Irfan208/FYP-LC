import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // ✅ Extract submissionId from query parameters
        const { searchParams } = new URL(req.url);
        const submissionId = searchParams.get("submissionId");

        if (!submissionId) {
            return new Response(JSON.stringify({ error: "Missing submissionId" }), { status: 400 });
        }

        // ✅ Fetch the plagiarism result from the database
        const plagiarismCheck = await prisma.plagiarismCheck.findUnique({
            where: { submissionId: Number(submissionId) },
            select: {
                plagiarismScore: true,
                plagiarismReport: true,
                checkedAt: true,
            },
        });

        if (!plagiarismCheck) {
            return new Response(JSON.stringify({ error: "No plagiarism data found for this submission" }), { status: 404 });
        }

        return new Response(
            JSON.stringify({
                plagiarismScore: plagiarismCheck.plagiarismScore || 0,
                plagiarismReport: plagiarismCheck.plagiarismReport || "No Report Available",
                checkedAt: plagiarismCheck.checkedAt,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("❌ Server Error in getPlagiarismResults:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
