import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();// Ensure this is correctly imported

export async function POST(req) {
  try {
    const { senderId, receiverId } = await req.json();

    // ✅ Debugging: Log the incoming request payload
    console.log("📩 Received Request for Chat History:", { senderId, receiverId });

    if (!senderId || !receiverId) {
      console.error("❌ Missing senderId or receiverId", { senderId, receiverId });
      return NextResponse.json(
        { error: "Missing senderId or receiverId" },
        { status: 400 }
      );
    }

    // ✅ Debugging: Check if the IDs exist in the database
    const senderExists = await db.user.findUnique({ where: { id: senderId } });
    const receiverExists = await db.user.findUnique({ where: { id: receiverId } });

    if (!senderExists || !receiverExists) {
      console.error("❌ Sender or Receiver not found:", { senderExists, receiverExists });
      return NextResponse.json(
        { error: "Sender or Receiver does not exist" },
        { status: 404 }
      );
    }

    console.log("✅ Sender & Receiver exist. Fetching messages...");

    // ✅ Fetch chat history
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    console.log("✅ Messages found:", messages);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
