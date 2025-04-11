import connectDB from '@/lib/db';
import Application from '@/models/Application';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';

export async function PUT(request, { params }) {
  await connectDB();

  try {
    const { Id } =await params;
    const { status } = await request.json();
    console.log("param application id", Id);
    
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return NextResponse.json(
        { success: false, message: "Invalid application ID" },
        { status: 400 }
      );
    }

    if (!['pending', 'reviewed', 'rejected', 'accepted'].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedApplication = await Application.findByIdAndUpdate(
     Id,
      { status },
      { new: true }
    ).lean();

    if (!updatedApplication) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedApplication,
        _id: updatedApplication._id.toString(),
        jobId: updatedApplication.jobId.toString(),
        applicantId: updatedApplication.applicantId.toString(),
        appliedAt: updatedApplication.appliedAt.toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Application update error:', error);
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

export async function GET() {
  await connectDB();

  try {
    const applications = await Application.find().lean();

    if (!applications || applications.length === 0) {
      return NextResponse.json(
        { success: false, message: "No applications found" },
        { status: 404 }
      );
    }

    const formattedApplications = applications.map(app => ({
      ...app,
      _id: app._id.toString(),
      jobId: app.jobId.toString(),
      applicantId: app.applicantId.toString(),
      appliedAt: app.appliedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: formattedApplications
    }, { status: 200 });

  } catch (error) {
    console.error('Application retrieval error:', error);
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

// export async function DELETE(request, { params }) {
//   await connectDB();

//   try {
//     const { Id } = params;
//     console.log("Deleting application ID:", Id);

//     // Validate application ID
//     if (!mongoose.Types.ObjectId.isValid(Id)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid application ID" },
//         { status: 400 }
//       );
//     }

//     // Find the application first to get the resume reference
//     const application = await Application.findById(Id);
    
//     if (!application) {
//       return NextResponse.json(
//         { success: false, message: "Application not found" },
//         { status: 404 }
//       );
//     }

//     // Delete from Cloudinary if resume exists
//     if (application.resume) {
//       try {
//         await cloudinary.v2.uploader.destroy(application.resume, {
//           resource_type: 'raw'
//         });
//         console.log("Successfully deleted resume from Cloudinary");
//       } catch (cloudinaryError) {
//         console.error('Cloudinary deletion error:', cloudinaryError);
//         // Continue with deletion even if Cloudinary fails
//       }
//     }

//     // Delete from database
//     const deletedApplication = await Application.findByIdAndDelete(Id);
    
//     if (!deletedApplication) {
//       return NextResponse.json(
//         { success: false, message: "Failed to delete application" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Application deleted successfully",
//       deletedId: Id
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Application deletion error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Server error during deletion",
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// Initialize Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request, { params }) {
  await connectDB();

  try {
    const awaitedParams = await params;
    const applicationId = awaitedParams.Id;
    
    console.log("Deleting application ID:", applicationId);

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return NextResponse.json(
        { success: false, message: "Invalid application ID format" },
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

    // Get public ID - prioritize stored publicId, fallback to URL parsing
    let publicId = application.resumePublicId;
    if (!publicId && application.resume) {
      try {
        const url = new URL(application.resume);
        // Extract the path after /upload/
        const pathParts = url.pathname.split('/upload/')[1].split('/');
        // The public ID is everything after /upload/ except the version (v123456)
        publicId = pathParts.slice(1).join('/').replace(/\..+$/, '');
        publicId = decodeURIComponent(publicId); // Decode %20 to spaces
        console.log("Extracted and decoded publicId:", publicId);
      } catch (e) {
        console.error("Error parsing URL:", e);
      }
    }

    // Delete from Cloudinary if public_id exists
    let cloudinaryDeleted = false;
    if (publicId) {
      try {
        console.log("Attempting to delete from Cloudinary:", publicId);
        
        const deletionResult = await cloudinary.uploader.destroy(publicId, {
          resource_type: 'raw',
          type: 'upload',
          invalidate: true
        });
        
        console.log("Cloudinary deletion result:", deletionResult);
        
        if (deletionResult.result === 'ok') {
          cloudinaryDeleted = true;
        } else {
          console.warn("File may not exist in Cloudinary:", deletionResult);
        }
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
      }
    }

    // Delete from database
    const deletedApplication = await Application.findByIdAndDelete(applicationId);
    
    if (!deletedApplication) {
      return NextResponse.json(
        { success: false, message: "Failed to delete application record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
      deletedId: applicationId,
      cloudinaryDeleted: cloudinaryDeleted
    }, { status: 200 });

  } catch (error) {
    console.error('Deletion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to complete deletion",
        error: error.message 
      },
      { status: 500 }
    );
  }
}