import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resume: String,
  resumeFilename: String,
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'accepted'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  resumePublicId: {
    type: String,
    // Add this setter to automatically extract public_id when storing URL
    set: function(url) {
      if (!url) return null;
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      return urlParts.slice(uploadIndex + 2).join('/').replace(/\..+$/, '');
    }
  },
  resumeUrl: String,
  resumeFilename: String
});

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);