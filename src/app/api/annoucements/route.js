import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/app/lib/sendEmail';
import { useSession } from "next-auth/react";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { text, courseId } = await req.json();

    if (!text || !courseId) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields (text or courseId).' }),
        { status: 400 }
      );
    }

    console.log(`📢 Received announcement request for Course ID: ${courseId}`);

    // Ensure courseId is an integer
    const parsedCourseId = parseInt(courseId, 10);
    if (isNaN(parsedCourseId)) {
      return new Response(
        JSON.stringify({ message: 'Invalid courseId format.' }),
        { status: 400 }
      );
    }

    // Save the announcement in the database
    const announcement = await prisma.announcement.create({
      data: {
        text,
        classId: parsedCourseId, // Using classId since DB uses it
      },
    });

    console.log(`✅ Announcement saved: ${announcement.id}`);

    // Fetch enrolled students
    const enrolledStudents = await prisma.enrollment.findMany({
      where: { classId: parsedCourseId }, // Fetch students for the course
      include: { student: true },
    });

    console.log(`📧 Found ${enrolledStudents.length} enrolled students`);

    // Notify students via email
    for (const enrollment of enrolledStudents) {
      try {
        const studentEmail = enrollment.student.email;
        const emailHtml = `
          <h2>📢 New Announcement has been posted.</h2>
          <p>${text}</p>
          <p>Stay updated with your course!</p>
        `;

        await sendEmail(studentEmail, 'New Class Announcement', emailHtml);
        console.log(`✅ Email sent to: ${studentEmail}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${enrollment.student.email}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Announcement posted successfully!', announcement }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error posting announcement:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function PATCH(req) {
    try {
      const { id, text } = await req.json();
  
      // Validate inputs
      if (!id || !text) {
        return new Response(
          JSON.stringify({ message: "Missing required fields (id or text)." }),
          { status: 400 }
        );
      }
  
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        return new Response(
          JSON.stringify({ message: "Invalid announcement ID format." }),
          { status: 400 }
        );
      }
  
      // Check if the announcement exists before updating
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { id: parsedId },
      });
  
      if (!existingAnnouncement) {
        return new Response(
          JSON.stringify({ message: "Announcement not found." }),
          { status: 404 }
        );
      }
  
      // Update the announcement in the database
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id: parsedId },
        data: { text },
      });
  
      return new Response(
        JSON.stringify({ message: "Announcement updated successfully!", announcement: updatedAnnouncement }),
        { status: 200 }
      );
  
    } catch (error) {
      console.error("❌ Error updating announcement:", error);
      return new Response(
        JSON.stringify({ message: "Failed to update announcement.", error: error.message }),
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
