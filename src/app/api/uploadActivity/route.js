import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/app/lib/sendEmail';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // ✅ Parse JSON request
    const { title, classId, description } = await req.json();

    // ✅ Validate required fields
    if (!title || !classId) {
      console.error("❌ Missing required fields:", { title, classId });
      return new Response(
        JSON.stringify({ message: 'Title and class ID are required' }),
        { status: 400 }
      );
    }

    // ✅ Create a new activity entry in the database
    const newActivity = await prisma.activity.create({
      data: {
        title,
        description: description || '', // Optional description
        classId: parseInt(classId, 10), // Ensure classId is an integer
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
        <h1>New Activity Created</h1>
        <p>A new class activity has been posted.</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong> ${description || 'No description provided'}</p>
      `;
      await sendEmail(studentEmail, 'New Activity Posted', emailHtml);
    }

    // ✅ Fetch all activities for the class
    const activities = await prisma.activity.findMany({
      where: { classId: parseInt(classId, 10) },
      orderBy: { createdAt: 'desc' }, // Orders activities by newest first
    });

    return new Response(
      JSON.stringify({ message: 'Activity created successfully', activity: newActivity, activities }),
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating activity:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create activity', error: error.message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function PATCH(req) {
  try {
    const { id, title, description, dueDate, fileUrl } = await req.json();

    // ✅ Validate input
    if (!id) {
      return new Response(
        JSON.stringify({ message: "Activity ID is required." }),
        { status: 400 }
      );
    }

    // ✅ Parse and validate dueDate
    let parsedDueDate = undefined;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate)) {
        return new Response(
          JSON.stringify({ message: "Invalid due date format." }),
          { status: 400 }
        );
      }
    }

    // ✅ Update activity in the database
    const updatedActivity = await prisma.activity.update({
      where: { id: parseInt(id, 10) }, // Ensure ID is an integer
      data: {
        title,
        description, // Allow updating the description
        dueDate: parsedDueDate, // Update due date if provided
        fileUrl, // Store new file URL if updated
      },
    });

    return new Response(
      JSON.stringify({
        message: "Activity updated successfully!",
        updatedActivity,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating activity:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update activity." }),
      { status: 500 }
    );
  }
}