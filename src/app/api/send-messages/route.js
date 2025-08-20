import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { senderId, receiverEmail, message } = await req.json();
    
    if (!senderId || !receiverEmail || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // ✅ Find the receiver (either a teacher or a student)
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail }, // No role filtering
    });

    if (!receiver) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // ✅ Save the message
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId: receiver.id,
        content: message,
      },
    });

    return new Response(JSON.stringify({ success: true, message: newMessage }), { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
