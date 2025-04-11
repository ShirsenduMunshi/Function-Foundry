import connectDB from '@/lib/db';
import Job from '@/models/Job';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  await connectDB();

  try {
    const formData = await request.formData();
    const employerId = formData.get('employer');
    const deadlineString = formData.get('deadline');

    // Validate employer ID
    if (!employerId || !mongoose.Types.ObjectId.isValid(employerId)) {
      return NextResponse.json(
        { success: false, message: "Valid employer ID is required" },
        { status: 400 }
      );
    }

    // Convert to ObjectId
    const employerObjectId = new mongoose.Types.ObjectId(employerId);
    
    // Validate required fields
    if (!deadlineString) {
      return NextResponse.json(
        { success: false, message: "Deadline is required" },
        { status: 400 }
      );
    }

    const deadline = new Date(deadlineString);
    if (isNaN(deadline.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid deadline format" },
        { status: 400 }
      );
    }

    // Process tags - handle both string and array formats
    let tags = [];
    try {
      const tagsInput = formData.get('tags');
      if (tagsInput) {
        tags = typeof tagsInput === 'string' 
          ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
          : [];
      }
    } catch (error) {
      console.error('Error processing tags:', error);
      tags = [];
    }

    // Prepare job data
    const jobData = {
      title: formData.get('title'),
      company: formData.get('company'),
      description: formData.get('description'),
      location: formData.get('location'),
      salary: Number(formData.get('salary')),
      employer: formData.get('employer'),
      tags: tags,
      employer: employerObjectId, // Use the converted ObjectId
      deadline: deadline,
    };

    // Handle logo upload if present
    const logoFile = formData.get('logo');
    if (logoFile) {
      try {
        const arrayBuffer = await logoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => error ? reject(error) : resolve(result)
          ).end(buffer);
        });

        jobData.logo = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Logo upload failed:', uploadError);
        return NextResponse.json(
          { 
            success: false,
            message: 'Logo upload failed',
            error: uploadError.message 
          },
          { status: 500 }
        );
      }
    }

    // Create and save job
    const job = new Job(jobData);
    await job.save();

    return NextResponse.json(
      { 
        success: true,
        message: 'Job created successfully',
        job 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in job creation:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create job',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const employerId = searchParams.get("employerId");

    if (!employerId) {
      return NextResponse.json(
        { message: "Employer ID is required" },
        { status: 400 }
      );
    }

    const jobs = await Job.find({ 
      employer: new mongoose.Types.ObjectId(employerId) 
    }).sort({ deadline: 1 });

    return NextResponse.json({ 
      success: true,
      allJobs: jobs 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch jobs",
        error: error.message 
      },
      { status: 500 }
    );
  }
}