// import cloudinary from 'cloudinary';
// import { NextResponse } from 'next/server';

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file');

//     if (!file) {
//       return NextResponse.json(
//         { message: 'No file provided' },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const buffer = await file.arrayBuffer();
//     const fileBuffer = Buffer.from(buffer);

//     // Upload to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.v2.uploader.upload_stream(
//         {
//           resource_type: 'raw',
//           folder: 'job_applications/resumes',
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(fileBuffer);
//     });

//     return NextResponse.json(
//       { url: result.secure_url },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { message: 'Failed to upload file', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// import cloudinary from 'cloudinary';
// import { NextResponse } from 'next/server';

// // Configure Cloudinary with your credentials
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file');

//     if (!file) {
//       return NextResponse.json(
//         { message: 'No file provided' },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const buffer = await file.arrayBuffer();
//     const fileBuffer = Buffer.from(buffer);

//     // Upload to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.v2.uploader.upload_stream(
//         {
//           resource_type: 'raw',
//           folder: 'job_applications/resumes',
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(fileBuffer);
//     });

//     return NextResponse.json({
//       url: result.secure_url,
//       filename: file.name
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { message: 'Failed to upload file', error: error.message },
//       { status: 500 }
//     );
//   }
// }

import cloudinary from 'cloudinary';
import { NextResponse } from 'next/server';
import path from 'path';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['application/pdf'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Process filename
    const originalName = file.name;
    const fileExt = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, fileExt);
    const cloudinaryPublicId = `resumes/${baseName}_${Date.now()}`;

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Upload to Cloudinary with explicit PDF settings
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'raw',
          public_id: cloudinaryPublicId,
          format: 'pdf', // Explicitly set format
          folder: 'job_applications/resumes',
          overwrite: false,
          tags: ['resume', 'application']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      filename: `${baseName}.pdf`, // Ensure .pdf extension
      format: result.format,
      bytes: result.bytes
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload resume',
        error: error.message 
      },
      { status: 500 }
    );
  }
}