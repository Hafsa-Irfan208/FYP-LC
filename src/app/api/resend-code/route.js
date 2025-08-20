import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/sendEmail";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Generate a new verification code
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();

    await prisma.user.update({
      where: { email },
      data: { verificationCode: newCode },
    });

    // Send the new code via email
    const emailHtml = `
      <h1>Resend Verification Code</h1>
      <p>Your new verification code is:</p>
      <h2>${newCode}</h2>
    `;
    await sendEmail(email, "Resend Verification Code", emailHtml);

    return NextResponse.json({ message: "A new code has been sent to your email." }, { status: 200 });
  } catch (error) {
    console.error("Error resending code:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
