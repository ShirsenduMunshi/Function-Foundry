import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// GET all applications for a specific job
export async function GET(request, { params }) {
  await connectDB();

  try {
    const { jobId } =await params;
    
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { success: false, message: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Verify the job exists
    const jobExists = await Job.exists({ _id: jobId });
    if (!jobExists) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Get applications with applicant details
    const applications = await Application.find({ jobId })
      .select('-__v -updatedAt')
      .sort({ appliedAt: -1 }) // Newest first
      .lean();

    return NextResponse.json({
      success: true,
      data: applications.map(app => ({
        ...app,
        _id: app._id.toString(),
        jobId: app.jobId.toString(),
        applicantId: app.applicantId.toString(),
        appliedAt: app.appliedAt.toISOString()
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
}