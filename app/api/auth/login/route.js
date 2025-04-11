import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { SignJWT } from "jose"; // Use jose for token signing
import { cookies } from "next/headers";

export async function POST(request) {
  await connectDB();

  const { email, password } = await request.json();
  // console.log("email:", email, "password:", password);

  try {
    const user = await User.findOne({ email });
    // console.log("User found:", user);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // console.log("Stored hashed password:", user.password);

    const isMatch = await user.comparePassword(password);
    // console.log("Password match result:", isMatch);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate a JWT token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user._id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // Set the token in a cookie
    let cookie = await cookies();
      cookie.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to login", error: error.message },
      { status: 500 }
    );
  }
}
