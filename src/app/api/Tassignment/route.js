import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/app/lib/sendEmail';
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { title, description, dueDate, classId, fileUrl } = await req.json();

    // Validate required fields
    if (!title || !dueDate || !classId || !fileUrl) {
      return new Response(
        JSON.stringify({ message: 'Title, due date, class ID, and fileUrl are required' }),
        { status: 400 }
      );
    }
    if (fileUrl && typeof fileUrl !== 'string') {
        return new Response(
          JSON.stringify({ message: 'Invalid file URL format' }),
          { status: 400 }
        );
      }
      
    // Parse and validate the due date
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate)) {
      return new Response(
        JSON.stringify({ message: 'Invalid due date format' }),
        { status: 400 }
      );
    }

    // Create a new assignment in the database
    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description: description || '', // Optional description
        dueDate: parsedDueDate,
        classId,
        fileUrl: fileUrl || null,
      },
    });
      // Fetch enrolled students for the class
      const enrolledStudents = await prisma.enrollment.findMany({
        where: { classId },
        include: { student: true },
      });
  
      // Send email notification to enrolled students
      for (const enrollment of enrolledStudents) {
        const studentEmail = enrollment.student.email;
        const emailHtml = `
          <h1>New Assignment Created</h1>
          <p>A new assignment has been posted in your class.</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Due Date:</strong> ${parsedDueDate.toDateString()}</p>
          <p><a href="${fileUrl}" target="_blank">View Assignment</a></p>
        `;
        await sendEmail(studentEmail, 'New Assignment Notification', emailHtml);
      }

      // Fetch the latest assignments after adding a new one
    const updatedAssignments = await prisma.assignment.findMany({
      where: { classId },
      orderBy: { dueDate: 'asc' },
    });
  

    return new Response(
      JSON.stringify({ message: 'Assignment created successfully', assignment: newAssignment }),
      { status: 201 }
     
    );
    window.location.reload();
  } catch (error) {
    console.error('Error saving assignment:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create assignment' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function PATCH(req) {
  try {
    const { id, title, description, dueDate ,fileUrl} = await req.json();

    // Validate input
    if (!id) {
      return new Response(
        JSON.stringify({ message: "Assignment ID is required." }),
        { status: 400 }
      );
    }

    // Parse and validate the due date
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

    // Update assignment in the database
    const updatedAssignment = await prisma.assignment.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,  // Allow updating the description
        dueDate: parsedDueDate, // Update due date if provided
        fileUrl, // Store new file URL if updated
      },
    });

    return new Response(
      JSON.stringify({ message: "Assignment updated successfully!", updatedAssignment }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating assignment:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update assignment." }),
      { status: 500 }
    );
  }
}

