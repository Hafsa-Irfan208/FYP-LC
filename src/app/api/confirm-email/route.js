import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const confirmationToken = searchParams.get('token'); // Get the token from query parameters

    if (!confirmationToken) {
        return new Response(
            JSON.stringify({ message: 'Invalid token' }),
            { status: 400 }
        );
    }

    console.log('Received GET request to /api/confirm-email', { confirmationToken });

    try {
        // Find the user by the confirmation token
        const user = await prisma.user.findFirst({
            where: { confirmationToken },
        });

        console.log('User found:', user);
 
        if (!user) {
            return new Response(
                JSON.stringify({ message: 'Invalid or expired token' }),
                { status: 400 }
            );
        }

        // Mark the user as confirmed
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isConfirmed: true,
                confirmationToken: null, // Clear the token after confirmation
            },
        });

        return new Response(
            JSON.stringify({ message: 'Email confirmed successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.log('Error confirming email:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
