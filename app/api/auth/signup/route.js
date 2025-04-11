// import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export async function POST(request) {
  await connectDB();

  try {
    // Convert the Web Request to a FormData object
    const formData = await request.formData();

    // Create a temporary directory if it doesn't exist
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // Create a Formidable form
    // const form = new IncomingForm();

    // Parse the form data manually
    const fields = {};
    const files = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle file uploads
        const fileBuffer = await value.arrayBuffer();
        const filePath = path.join(tmpDir, value.name);

        // Save the file to the temporary directory
        fs.writeFileSync(filePath, Buffer.from(fileBuffer));

        files[key] = {
          filepath: filePath, // Temporary file path
          originalFilename: value.name,
          mimetype: value.type,
          size: value.size,
        };
      } else {
        // Handle regular fields
        fields[key] = value;
      }
    }

    // Extract fields
    const { name, email, password, role, bio, skills } = fields;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Upload resume to Cloudinary (if provided)
    let resumeUrl = '';
    if (files.resume) {
      const resumeResult = await cloudinary.v2.uploader.upload(files.resume.filepath, {
        resource_type: 'raw',
        folder: 'resumes',
      });
      resumeUrl = resumeResult.secure_url;

      // Delete the temporary file after upload
      fs.unlinkSync(files.resume.filepath);
    }

    // Upload profile picture to Cloudinary (if provided)
    let profilePictureUrl = '';
    if (files.profilePicture) {
      const profilePictureResult = await cloudinary.v2.uploader.upload(files.profilePicture.filepath, {
        folder: 'profile_pictures',
      });
      profilePictureUrl = profilePictureResult.secure_url;

      // Delete the temporary file after upload
      fs.unlinkSync(files.profilePicture.filepath);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password from signup:", hashedPassword);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        bio,
        skills: skills.split(',').map((s) => s.trim()),
        resume: resumeUrl,
        profilePicture: profilePictureUrl,
      },
    });

    await user.save();

    return new Response(JSON.stringify({ message: 'User created successfully', user }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to create user', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}