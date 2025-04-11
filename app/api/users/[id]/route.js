import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req, { params }) {
  try {
    await connectDB();
    // Get the raw authToken from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // The entire header is our token
    const authToken = authHeader;
    // console.log("Full authToken received:", authToken);
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Parse the token to verify the user
    let parsedToken;
    try {
      parsedToken = JSON.parse(authToken);
      // console.log("Successfully parsed token:", parsedToken);
    } catch (error) {
      console.error("Error parsing token:", error);
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }
    // Verify token structure
    if (!parsedToken?.token?.user?._id) {
      return NextResponse.json(
        { error: "Invalid token structure" },
        { status: 401 }
      );
    }
    const tokenUserId = parsedToken.token.user._id;
    const awaitedParam = await params;
    // Verify the requested user matches the token user
    if (awaitedParam.id !== tokenUserId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    const user = await User.findById(awaitedParam.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    // Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authToken = authHeader;
    let parsedToken;

    try {
      parsedToken = JSON.parse(authToken);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }

    if (!parsedToken?.token?.user?._id) {
      return NextResponse.json(
        { error: "Invalid token structure" },
        { status: 401 }
      );
    }

    const tokenUserId = parsedToken.token.user._id;
    const Params = await params;
    if (Params.id !== tokenUserId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Handle FormData
    const formData = await req.formData();
    const updateData = Object.fromEntries(formData);

    // Handle file upload
    let profilePictureUrl = updateData.existingProfilePicture || "";
    const profilePictureFile = formData.get("profilePicture");

    if (profilePictureFile && profilePictureFile.name !== "undefined") {
      try {
        const arrayBuffer = await profilePictureFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "profile-pictures",
                resource_type: "image",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        profilePictureUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Handle skills - parse and validate
    let skills = [];
    if (updateData.skills) {
      try {
        skills = JSON.parse(updateData.skills)
          .map((skill) => skill.trim()) // Trim all skills
          .filter((skill) => skill !== ""); // Remove empty strings
      } catch (error) {
        console.error("Error parsing skills:", error);
        return NextResponse.json(
          { error: "Invalid skills format" },
          { status: 400 }
        );
      }
    }

    // Prepare update object
    const updateObject = {
      name: updateData.name || undefined,
      profile: {
        bio: updateData.bio || undefined,
        skills: skills.length > 0 ? skills : undefined, // Only include if not empty
        profilePicture: profilePictureUrl || undefined,
      },
    };

    // Clean undefined values
    Object.keys(updateObject).forEach(
      (key) => updateObject[key] === undefined && delete updateObject[key]
    );
    if (updateObject.profile) {
      Object.keys(updateObject.profile).forEach(
        (key) =>
          updateObject.profile[key] === undefined &&
          delete updateObject.profile[key]
      );
    }

    // Update user
    const awatedParam = await params;
    if (!awatedParam.id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const updatedUser = await User.findByIdAndUpdate(
      awatedParam.id,
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
