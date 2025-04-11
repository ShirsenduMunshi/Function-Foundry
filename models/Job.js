import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  logo: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true } // Made required and kept as Date type
});

// Create index for better query performance
jobSchema.index({ employer: 1 });
jobSchema.index({ deadline: 1 });

export default mongoose.models.jobs || mongoose.model('jobs', jobSchema);