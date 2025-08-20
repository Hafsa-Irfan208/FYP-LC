import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.verificationCode !== code) {
      return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { isConfirmed: true, verificationCode: null },
    });

    const redirectUrl =  "/signin";

    return NextResponse.json({ message: "Verification successful!", redirectUrl }, { status: 200 });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
