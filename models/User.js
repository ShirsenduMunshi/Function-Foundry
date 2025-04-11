import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employer', 'candidate'], required: true }, // Fixed typo: 'employer' instead of 'employer'
  profile: {
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    resume: { type: String, default: '' }, // URL to the resume stored in Cloudinary
    profilePicture: { type: String, default: '' }, // URL to the profile picture stored in Cloudinary
  },
  createdAt: { type: Date, default: Date.now },
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  // console.log("Received password:", candidatePassword);
  // console.log("Stored hashed password:", this.password);

  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    // console.log("Password match result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

// Ensure the model is not redefined if it already exists
export default mongoose.models.User || mongoose.model('User', userSchema);
