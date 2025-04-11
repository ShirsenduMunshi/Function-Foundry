import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { jobId, applicantId, name, email, resume, coverLetter } = body;

    // Validate required fields
    if (!jobId || !applicantId || !name || !email || !resume) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields (jobId, applicantId, name, email, or resume)' 
        },
        { status: 400 }
      );
    }

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(applicantId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid jobId or applicantId format' },
        { status: 400 }
      );
    }

    // Check if job exists
    const jobExists = await Job.exists({ _id: jobId });
    if (!jobExists) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user exists
    const userExists = await User.exists({ _id: applicantId });
    if (!userExists) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({ 
      job: jobId, 
      applicantId: applicantId 
    });
    if (existingApplication) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'You have already applied to this job',
          applicationId: existingApplication._id 
        },
        { status: 409 }
      );
    }

    // Create new application
    const application = new Application({
      jobId,
      applicantId,
      name,
      email,
      resume,
      coverLetter: coverLetter || '',
      status: 'pending'
    });

    await application.save();

    // Return the created application with proper data formatting

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        ...application,
        resumeUrl: application.resume, // Full Cloudinary URL
        resumeFilename: application.resumeFilename, // Original filename with extension
        _id: application._id.toString(),
        jobId: application.jobId.toString(),
        applicantId: application.applicantId.toString(),
        name: application.name,
        email: application.email,
        resume: application.resume,
        coverLetter: application.coverLetter,
        status: application.status,
        appliedAt: application.appliedAt.toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit application',
        error: error.message,
        details: error.errors // Include validation error details
      },
      { status: 500 }
    );
  }
}

// export async function GET(request) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const applicantId = searchParams.get("applicantId");
//     // console.log("applicationId", applicantId);
    
//     if (!applicantId) {
//       return new Response(JSON.stringify({ error: "Applicant ID is required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const applications = await Application.find({ applicantId })
//       .populate({
//         path: "jobId",
//         select: "title company",
//         populate: {
//           path: "company",
//           select: "name",
//         }
//       })
//       .sort({ appliedAt: -1 });

//     return new Response(JSON.stringify(applications), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return new Response(JSON.stringify({ error: "Failed to fetch applications" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const applicantId = searchParams.get("applicantId");
    
    if (!applicantId) {
      return new Response(JSON.stringify({ error: "Applicant ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const applications = await Application.find({ applicantId })
    .populate({
      path: "jobId",
      select: "title company description location salary logo", // Select the fields you want
      model: Job // Explicitly use your Job model
    })
    .sort({ appliedAt: -1 });
    // console.log("applications", applications);

    return new Response(JSON.stringify(applications), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch applications" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}