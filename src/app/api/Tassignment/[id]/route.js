import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { title, description, dueDate, fileUrl } = await req.json();

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
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(parsedDueDate && { dueDate: parsedDueDate }),
        ...(fileUrl !== undefined && { fileUrl }),
      },
    });

    return new Response(
      JSON.stringify({ 
        message: "Assignment updated successfully!", 
        assignment: updatedAssignment 
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error updating assignment:", error);
    return new Response(
      JSON.stringify({ 
        message: "Failed to update assignment.",
        error: error.message 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
} 