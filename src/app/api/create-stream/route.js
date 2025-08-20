import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const type = formData.get("type"); // "assignment", "announcement", "material"
    const classId = parseInt(formData.get("classId"));
    const file = formData.get("file");

    if (!title || !type || !classId) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    let fileUrl = null;
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      fileUrl = `https://your-s3-bucket.com/${fileName}`; // Replace with S3 logic
    }

    const streamItem = await prisma.stream.create({
      data: { title, description, type, classId, fileUrl },
    });

    return new Response(JSON.stringify({ message: "Post created successfully", streamItem }), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ message: "Failed to create post" }), { status: 500 });
  }
}
