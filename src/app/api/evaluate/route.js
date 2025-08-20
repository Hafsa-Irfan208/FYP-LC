import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JUDGE0_API_KEY = "7aa606586cmsh492323f7ae47257p16ea66jsnd17ae292ccbc";

const JUDGE0_API_HOST = "judge0-ce.p.rapidapi.com";

// ✅ Encode Base64 safely
const encodeBase64 = (text) => Buffer.from(text).toString("base64");

// ✅ Submit Code to Judge0 API
const submitToJudge0 = async (sourceCode, input) => {
    const url = `https://${JUDGE0_API_HOST}/submissions?base64_encoded=true&wait=false&fields=*`;

    const options = {
        method: "POST",
        headers: {
            "x-rapidapi-key": JUDGE0_API_KEY,
            "x-rapidapi-host": JUDGE0_API_HOST,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            language_id: 52, // C++ (GCC 9.2)
            source_code: encodeBase64(sourceCode),
            stdin: encodeBase64(input),
        }),
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data.token) {
            console.error("❌ Judge0 Failed to Return Token:", data);
            return null;
        }

        return data.token; // ✅ Return token if successful
    } catch (error) {
        console.error("❌ Error submitting to Judge0:", error);
        return null;
    }
};

// ✅ Fetch Results from Judge0 API
const fetchResultsFromJudge0 = async (token) => {
    if (!token) {
        console.error("❌ Missing token for Judge0 execution");
        return null;
    }

    const url = `https://${JUDGE0_API_HOST}/submissions/${token}?base64_encoded=true&fields=*`;

    try {
        while (true) {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": JUDGE0_API_KEY,
                    "x-rapidapi-host": JUDGE0_API_HOST,
                },
            });

            if (response.status === 429) { // ✅ Handle "Too Many Requests"
                console.warn("⚠️ Rate limited by Judge0. Retrying in 5 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 5000));
                continue; // Retry fetching results
            }

            if (!response.ok) {
                console.error(`❌ Judge0 API error: ${response.status} ${response.statusText}`);
                return null;
            }

            const result = await response.json();

            if (!result || !result.status || !result.status.description) {
                console.error("❌ Invalid response from Judge0:", result);
                return null;
            }

            console.log("✅ Judge0 Response:", result);

            const status = result.status.description;

            if (status === "In Queue" || status === "Processing") {
                await new Promise((resolve) => setTimeout(resolve, 2000)); // ✅ Wait 2 sec
            } else {
                return result;
            }
        }
    } catch (error) {
        console.error("❌ Error fetching results from Judge0:", error);
        return null;
    }
};

// ✅ Evaluate ALL Student Submissions
export async function POST(req) {
    try {
        const body = await req.json();
        let { assignmentId } = body;

        if (!assignmentId) {
            return new Response(JSON.stringify({ error: "Missing assignmentId" }), { status: 400 });
        }

        // ✅ Check if assignment exists in DB
        const assignmentExists = await prisma.assignment.findUnique({ where: { id: assignmentId } });
        if (!assignmentExists) {
            return new Response(JSON.stringify({ error: "Assignment not found" }), { status: 404 });
        }

        // ✅ Fetch test cases & student submissions
        const [testCases, submissions] = await Promise.all([
            prisma.testCase.findMany({ 
                where: { assignmentId },
                select: { id: true, questionNumber: true, input: true, expectedOutput: true }, // ✅ Explicitly select expectedOutput
            }),
            prisma.submission.findMany({ where: { assignmentId } }),
        ]);

        if (!submissions.length) {
            return new Response(JSON.stringify({ error: "No submissions found for this assignment" }), { status: 404 });
        }

        if (!testCases.length) {
            return new Response(JSON.stringify({ error: "No test cases found for this assignment" }), { status: 404 });
        }

        console.log("✅ Test Cases Fetched:", testCases);

        let evaluationResults = [];

        // ✅ Process all submissions
        await Promise.all(submissions.map(async (submission) => {
            let questionResults = [];

            await Promise.all(testCases.map(async (testCase) => {
                if (submission.questionNumber !== testCase.questionNumber) return;

                console.log(`🔄 Processing Test Case ${testCase.id} for Student ${submission.studentId}`);

                // ✅ Submit Code to Judge0 with API Throttling
                await new Promise((resolve) => setTimeout(resolve, 1500)); // ✅ Delay to avoid hitting rate limit

                const token = await submitToJudge0(submission.sourcecode, testCase.input);
                if (!token) {
                    console.error(`❌ Failed to get token for student ${submission.studentId}, test case ${testCase.id}`);
                    return;
                }

                // ✅ Fetch Result from Judge0
                const result = await fetchResultsFromJudge0(token);
                if (!result) {
                    console.error(`❌ Failed to fetch result for student ${submission.studentId}, test case ${testCase.id}`);
                    return;
                }

                // ✅ Log the result before processing
                console.log("🔎 Judge0 Raw Result:", result);

                // ✅ Ensure `expectedOutput` is never `null`
                const expected = testCase.expectedOutput ? testCase.expectedOutput.toString().trim() : "";
                const output = result.stdout ? Buffer.from(result.stdout, "base64").toString().trim() : "";

                // ✅ Log expected vs actual output
                console.log(`✅ Checking Output: Expected: "${expected}", Got: "${output}"`);

                const passed = output === expected;

                questionResults.push({
                    // testCaseId: testCase.id,
                    questionNumber: testCase.questionNumber,
                    // output,
                    // expectedOutput: expected,
                    // error: result.stderr ? Buffer.from(result.stderr, "base64").toString() : "No errors",
                    // status: result.status.description,
                    passed,
                });
            }));

            if (questionResults.length > 0) { 
                evaluationResults.push({
                    studentId: submission.studentId,
                    assignmentId,
                    results: JSON.stringify(questionResults),
                });
            }
        }));

        // ✅ **Fix: Prevent Database Error When `evaluationResults` is Empty**
        if (evaluationResults.length > 0) {
            await prisma.evaluation.createMany({ data: evaluationResults });
            console.log("✅ Evaluations inserted into DB");
            // ✅ Mark submissions as checked
    await prisma.submission.updateMany({
        where: { assignmentId },
        data: { checked: true },
    });
    
        } else {
            console.warn("⚠️ No valid evaluations to insert.");
        }

        console.log("✅ Evaluation complete!");
        return new Response(JSON.stringify({ message: "Evaluation complete", evaluationResults }), { status: 200 });

    } catch (error) {
        console.error("❌ Server Error Evaluating Submissions:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}