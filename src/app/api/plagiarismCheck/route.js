import { PrismaClient } from "@prisma/client";
import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { assignmentId } = await req.json();

    // Step 1: Fetch latest submissions (1 per student)
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      orderBy: { submittedAt: "desc" },
      distinct: ["studentId"],
      include: {
        student: true,
      },
    });

    if (submissions.length < 2) {
      return NextResponse.json({ error: "Need at least two student submissions." }, { status: 400 });
    }

    // Step 2: Extract code + map back
    const code_list = submissions.map((sub) => sub.sourcecode);
    const id_map = submissions.map((sub) => ({
      id: sub.id,
      name: `${sub.student.firstName} ${sub.student.lastName}`,
      code: sub.sourcecode, // ✅ Add this
    }));

    // Step 3: Spawn Python checker
    const scriptPath = path.resolve("src/utils/plagiarism_checker.py");
    const py = spawn("python", [scriptPath]);

    let output = "";
    let error = "";

    py.stdout.on("data", (data) => (output += data.toString()));
    py.stderr.on("data", (data) => (error += data.toString()));

    py.stdin.write(JSON.stringify({ code_list }));
    py.stdin.end();

    return new Promise((resolve) => {
      py.on("close", async () => {
        if (error) {
          console.error("🐍 Python Error:", error);
          return resolve(NextResponse.json({ error: error.trim() }, { status: 500 }));
        }

        try {
          const parsed = JSON.parse(output);

          // Step 4: Store results in DB
          await Promise.all(
            parsed.results.map(async (result) => {
              const aIndex = parseInt(result.file1.replace("Student_", "")) - 1;
              const bIndex = parseInt(result.file2.replace("Student_", "")) - 1;

              const a = id_map[aIndex];
              const b = id_map[bIndex];
              // Attach actual code to result
result.student1Id = a.id;
result.student2Id = b.id;
result.code1 = a.code;
result.code2 = b.code;

              await prisma.plagiarismCheck.createMany({
                data: [
                  {
                    submissionId: submissions[aIndex].id,
                    plagiarismScore: result.score,
                    plagiarismReport: `${a.name} vs ${b.name}`,
                    checkedAt: new Date(),
                    passed: result.score < 50,
                  },
                  {
                    submissionId: submissions[bIndex].id,
                    plagiarismScore: result.score,
                    plagiarismReport: `${a.name} vs ${b.name}`,
                    checkedAt: new Date(),
                    passed: result.score < 50,
                  },
                ],
                skipDuplicates: true,
              });
            })
          );

          resolve(NextResponse.json(parsed, { status: 200 }));
        } catch (err) {
          console.error("❌ Error parsing plagiarism result:", output);
          resolve(NextResponse.json({ error: "Error parsing plagiarism result" }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
