import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/app/lib/sendEmail';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // ✅ Properly parse the request JSON
    const { title, classId, fileUrl } = await req.json();

    // ✅ Validate required fields
    if (!title || !classId || !fileUrl) {
      console.error("❌ Missing required fields:", { title, classId, fileUrl });
      return new Response(
        JSON.stringify({ message: 'Title, class ID, and fileUrl are required' }),
        { status: 400 }
      );
    }

    if (typeof fileUrl !== 'string') {
      console.error("❌ Invalid file URL format:", fileUrl);
      return new Response(
        JSON.stringify({ message: 'Invalid file URL format' }),
        { status: 400 }
      );
    }

    // ✅ Create a new material entry in the database
    const newMaterial = await prisma.material.create({
      data: {
        title,
        classId: parseInt(classId, 10), // Ensure classId is an integer
        fileUrl,
      },
    });

    // ✅ Fetch enrolled students for the class
    const enrolledStudents = await prisma.enrollment.findMany({
      where: { classId: parseInt(classId, 10) },
      include: { student: true },
    });

    // ✅ Send email notifications to enrolled students
    for (const enrollment of enrolledStudents) {
      const studentEmail = enrollment.student.email;
      const emailHtml = `
        <h1>New Material Uploaded</h1>
        <p>A new study material has been uploaded for your class.</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><a href="${fileUrl}" target="_blank">Download Material</a></p>
      `;
      await sendEmail(studentEmail, 'New Material Available', emailHtml);
    }

    // ✅ Fetch all materials for the class
    const materials = await prisma.material.findMany({
      where: { classId: parseInt(classId, 10) },
      orderBy: { createdAt: 'desc' }, // Orders materials by newest first
    });

    return new Response(
      JSON.stringify({ message: 'Material uploaded successfully', material: newMaterial, materials }),
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error saving material:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create material', error: error.message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function PATCH(req) {
    try {
        const { id, title, fileUrl } = await req.json();

        // Validate input
        if (!id) {
            return new Response(
                JSON.stringify({ message: "Material ID is required." }),
                { status: 400 }
            );
        }

        // Update material in the database
        const updatedMaterial = await prisma.material.update({
            where: { id: parseInt(id, 10) },
            data: {
                title,
                fileUrl, // Store new file URL if updated
            },
        });

        return new Response(
            JSON.stringify({ message: "Material updated successfully!", updatedMaterial }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating material:", error);
        return new Response(
            JSON.stringify({ message: "Failed to update material." }),
            { status: 500 }
        );
    }
}