import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose for token verification

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // console.log("Middleware token:", token); // Log the token

    if (request.nextUrl.pathname.startsWith('/api')) {
      return;
    }

  if (!token) {
    console.log("No token found");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // console.log("Decoded token:", payload); // Log decoded data
    return NextResponse.next();
  } catch (error) {
    // console.log("Token verification failed:", error.message); // Log the error
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard'], // Add routes you want to protect
};