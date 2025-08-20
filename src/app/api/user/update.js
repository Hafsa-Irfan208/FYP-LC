import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Adjust based on your folder structure
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const age = formData.get("age");
    const gender = formData.get("gender");
    const profilePictureFile = formData.get("profilePicture");

    let profilePictureUrl = null;

    // Handle file upload (e.g., upload to cloud storage or save to file system)
    if (profilePictureFile) {
      const arrayBuffer = await profilePictureFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // Example: Use cloud storage or some method to save the file and get its URL
      // profilePictureUrl = await uploadToCloud(buffer, profilePictureFile.name);
      profilePictureUrl = `/uploads/${profilePictureFile.name}`; // Example local path
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName,
        lastName,
        email,
        age: parseInt(age, 10),
        gender,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
