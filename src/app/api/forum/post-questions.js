import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma"; 
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { questionText } = await request.json();
    if (!questionText) {
      return NextResponse.json({ message: "Question cannot be empty" }, { status: 400 });
    }

    const newQuestion = await prisma.forum.create({
      data: {
        studentId: session.user.id,
        studentName: session.user.name, // Store student name
        text: questionText,
      },
    });

    return NextResponse.json(newQuestion);
  } catch (error) {
    console.error("Error posting question:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
