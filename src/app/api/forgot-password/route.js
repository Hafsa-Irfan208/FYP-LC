import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/sendEmail";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with reset token and expiry time
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: verificationCode,
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
      },
    });

    // Send email with the verification code
    const emailHtml = `
      <h1>Reset Password Verification Code</h1>
      <p>Your verification code is:</p>
      <h2>${verificationCode}</h2>
      <p>This code is valid for 15 minutes.</p>
    `;
    await sendEmail(email, "Password Reset Verification Code", emailHtml);

    return NextResponse.json({ message: "Verification code sent to your email." }, { status: 200 });
  } catch (error) {
    console.error("Error sending code:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { email, code, newPassword } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Validate the verification code and expiry
    if (
      user.resetPasswordToken !== code ||
      user.resetPasswordExpires < new Date()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear the reset token
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
