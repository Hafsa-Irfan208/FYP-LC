import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { className, section, subject, room, teacherId } = await req.json();

    if (!className || !teacherId) {
      return new Response(
        JSON.stringify({ message: 'Class name and teacher ID are required' }),
        { status: 400 }
      );
    }

    // Generate a unique class code
    const classCode = `CLS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Create the class in the database
    const newClass = await prisma.class.create({
      data: {
        name: className,
        section,
        subject,
        room,
        classCode,
        teacherId,
      },
    });

    return new Response(JSON.stringify({ message: 'Class created successfully', class: newClass }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to create class' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
