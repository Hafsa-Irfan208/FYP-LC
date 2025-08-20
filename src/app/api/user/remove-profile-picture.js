import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    // Update the user profile to remove the profile picture
    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: null },
    });

    return NextResponse.json({ message: "Profile picture removed successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error removing profile picture:", error);
    return NextResponse.json({ message: "Failed to remove profile picture." }, { status: 500 });
  }
}
