import connectDB from '@/lib/db';
import jobs from '@/models/Job';
import User from '@/models/User'; // Import the User model
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  try {
    const allJobs = await jobs.find(); // Populate employer details
    return NextResponse.json({ allJobs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch jobs', error: error.message }, { status: 500 });
  }
}