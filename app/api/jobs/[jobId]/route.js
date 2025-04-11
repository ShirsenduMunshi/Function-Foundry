import connectDB from '@/lib/db';
import Job from '@/models/Job';
import Application from '@/models/Application';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const job = await Job.findById(jobId)
      .select('-__v -updatedAt') // Exclude unnecessary fields
      .lean();
    
    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Format data specifically for the detail page
    const formattedJob = {
      _id: job._id.toString(),
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: Number(job.salary) || 0,
      description: job.description || '',
      tags: job.tags || [],
      deadline: job.deadline?.toISOString() || null,
      createdAt: job.createdAt?.toISOString() || new Date().toISOString(),
      // Add any additional fields needed for your detail page
    };

    return NextResponse.json({
      success: true,
      data: formattedJob
    }, { status: 200 });

  } catch (error) {
    console.error('Job fetch error:', error);
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

export async function PUT(request, { params }) {
    await connectDB();
  
    try {
      const { jobId } =await params;
      const body = await request.json();
  
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return NextResponse.json(
          { success: false, message: "Invalid job ID" },
          { status: 400 }
        );
      }
  
      // Validate required fields
      if (!body.title || !body.company || !body.description) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }
  
      // Handle tags conversion - works with both array and comma-separated string
      let tagsArray = [];
      if (Array.isArray(body.tags)) {
        tagsArray = body.tags;
      } else if (typeof body.tags === 'string') {
        tagsArray = body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
  
      // Prepare update data
      const updateData = {
        title: body.title,
        company: body.company,
        location: body.location,
        salary: Number(body.salary) || 0,
        description: body.description,
        deadline: body.deadline ? new Date(body.deadline) : null,
        tags: tagsArray
      };
  
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        updateData,
        { new: true, runValidators: true }
      ).lean();
  
      if (!updatedJob) {
        return NextResponse.json(
          { success: false, message: "Job not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        success: true,
        data: {
          ...updatedJob,
          _id: updatedJob._id.toString(),
          salary: Number(updatedJob.salary),
          deadline: updatedJob.deadline?.toISOString(),
          createdAt: updatedJob.createdAt?.toISOString()
        }
      }, { status: 200 });
  
    } catch (error) {
      console.error('Job update error:', error);
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

  export async function DELETE(request, { params }) {
    await connectDB();
  
    try {
      // Proper parameter destructuring
      const awaitedParam = await params; 
      // console.log("Deleting job params: ", awaitedParam);
      const jobId = awaitedParam.jobId; // Changed from awaitedParams.id to params.id
      // console.log("Deleting job ID:", jobId);

    // Validate job ID
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { success: false, message: "Invalid job ID format" },
        { status: 400 }
      );
    }
  
      // First find the job to get any associated files
      const job = await Job.findById(jobId);
      
      if (!job) {
        return NextResponse.json(
          { success: false, message: "Job not found" },
          { status: 404 }
        );
      }
  
      // Delete associated applications and their resumes
      const applications = await Application.find({ jobId: jobId });
      let deletedApplicationsCount = 0;
      let deletedResumesCount = 0;
  
      for (const application of applications) {
        // Delete from Cloudinary if resume exists
        if (application.resumePublicId) {
          try {
            const result = await cloudinary.uploader.destroy(
              application.resumePublicId,
              { resource_type: 'raw' }
            );
            if (result.result === 'ok') deletedResumesCount++;
          } catch (error) {
            console.error(`Error deleting resume ${application.resumePublicId}:`, error);
          }
        }
        // Delete application record
        await Application.findByIdAndDelete(application._id);
        deletedApplicationsCount++;
      }
  
      // Delete the job itself
      const deletedJob = await Job.findByIdAndDelete(jobId);
      
      if (!deletedJob) {
        return NextResponse.json(
          { success: false, message: "Failed to delete job record" },
          { status: 500 }
        );
      }
  
      return NextResponse.json({
        success: true,
        message: "Job and associated data deleted successfully",
        deletedJobId: jobId,
        deletedApplications: deletedApplicationsCount,
        deletedResumes: deletedResumesCount
      }, { status: 200 });
  
    } catch (error) {
      console.error('Job deletion error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to complete job deletion",
          error: error.message 
        },
        { status: 500 }
      );
    }
  }