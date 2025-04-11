import connectDB from '@/lib/db';
import Application from '@/models/Application';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  await connectDB();

  try {
    // Properly await the params object first
    const awaitedParams = await params;
    const applicationId = awaitedParams.id;
    
    if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
      return NextResponse.json(
        { success: false, message: "Invalid application ID" },
        { status: 400 }
      );
    }

    const application = await Application.findById(applicationId);
    
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    if (!application.resume) {
      return NextResponse.json(
        { success: false, message: "No resume URL found" },
        { status: 404 }
      );
    }

    // Create safe filename
    let filename = application.resumeFilename || 'resume.pdf';
    filename = filename.replace(/[^\w.-]/g, '_'); // Replace special chars
    if (!filename.endsWith('.pdf')) filename += '.pdf';

    // Return both URL and filename
    return NextResponse.json({
      success: true,
      url: application.resume,
      filename: filename
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to prepare download",
        error: error.message 
      },
      { status: 500 }
    );
  }
}