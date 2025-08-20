import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Get all forum questions
export async function GET() {
  try {
    const questions = await prisma.forumPost.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        replies: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("🔥 Error fetching forum questions:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

// Post a new question
export async function POST(request) {
  try {
    const { text, userId } = await request.json();

    if (!text || !userId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newQuestion = await prisma.forumPost.create({
      data: {
        text: text,
        userId: userId,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 }); // ✅ Return created question
  } catch (error) {
    console.error("🔥 Error posting question:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}


