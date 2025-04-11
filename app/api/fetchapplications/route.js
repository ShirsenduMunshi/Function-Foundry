import connectDB from '@/lib/db';
import application from '@/models/Application';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  try {
    const allApplications = await application.find();
    return NextResponse.json({ allApplications }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch applications', error: error.message }, { status: 500 });
  }
}
