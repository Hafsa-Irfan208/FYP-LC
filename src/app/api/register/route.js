import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/sendEmail";

// Validate Email Function (Checks for disposable and format validation)
async function validateEmail(email) {
  const disposableDomains = ["mailinator.com", "temp-mail.org", "10minutemail.com"]; // Example list of disposable domains
  const emailParts = email.split("@");
  if (emailParts.length !== 2) return { isValid: false, message: "Invalid email format." };

  const domain = emailParts[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    return { isValid: false, message: "Disposable emails are not allowed." };
  }

  // Simulate additional validation if needed (e.g., API-based validation)
  return { isValid: true, message: "Email is valid." };
}
export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, CNIC, age, gender, role } = body;

    // Validate all required fields
    if (!firstName || !lastName || !email || !password || !CNIC || !gender || !role) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Validate First Name: Only allow letters, dots, no numbers or special characters
    if (!/^[a-zA-Z.]+$/.test(firstName)) {
      return NextResponse.json({ message: "First name must contain only letters and dots." }, { status: 400 });
    }

    // Validate Last Name: Only allow letters, no special characters, no dots
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      return NextResponse.json({ message: "Last name must contain only letters." }, { status: 400 });
    }

    // Validate Email: Ensure it contains '@' and no blank spaces
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email format." }, { status: 400 });
    }

    // Validate CNIC: Must follow the dashed format (XXXXX-XXXXXXX-X)
    if (!/^\d{5}-\d{7}-\d{1}$/.test(CNIC)) {
      return NextResponse.json({ message: "CNIC must follow the format XXXXX-XXXXXXX-X." }, { status: 400 });
    }

    // Check for unique CNIC
    const existingCNIC = await prisma.user.findUnique({
      where: { CNIC },
    });
    if (existingCNIC) {
      return NextResponse.json({ message: "CNIC is already registered." }, { status: 409 });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        message: "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces.",
      }, { status: 400 });
    }

    // Normalize and validate role and gender
    const normalizedRole = role.toLowerCase();
    const validRoles = ["student", "teacher"];
    const validGenders = ["male", "female", "other"];

    if (!validRoles.includes(normalizedRole)) {
      return NextResponse.json({ message: "Invalid role selected." }, { status: 400 });
    }

    if (!validGenders.includes(gender.toLowerCase())) {
      return NextResponse.json({ message: "Invalid gender selected." }, { status: 400 });
    }

    // Check for unique email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
    }

    // Encrypt the password and CNIC
    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedCNIC = await bcrypt.hash(CNIC, 10);

    // Generate a 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Create the new user in the database
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        CNIC: encryptedCNIC,
        age: age ? parseInt(age, 10) : null,
        gender: gender.toLowerCase(),
        role: normalizedRole,
        verificationCode,
        isConfirmed: false,
      },
    });

    // Send verification email
    const emailHtml = `
      <h1>Verify Your Email</h1>
      <p>Thank you for registering with us. Please use the following 4-digit code to verify your email:</p>
      <h2>${verificationCode}</h2>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(email, "Verify Your Email Address", emailHtml);

    return NextResponse.json({
      message: "User registered successfully. A verification code has been sent to your email.",
    }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later." }, { status: 500 });
  }
}
