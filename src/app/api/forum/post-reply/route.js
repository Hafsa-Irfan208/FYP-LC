import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse request body
    const { postId, replyText, userId } = await request.json();

    if (!replyText || !postId || !userId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Validate if the post exists
    const existingPost = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "Forum post not found" }, { status: 404 });
    }

    // Create a new reply
    const newReply = await prisma.forumReply.create({
      data: {
        postId,
        text: replyText,
        userId,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(newReply, { status: 201 }); // ✅ Successfully posted reply
  } catch (error) {
    console.error("🔥 Error posting reply:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
