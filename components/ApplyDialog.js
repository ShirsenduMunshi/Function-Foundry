"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";

export default function ApplyDialog({ jobId, userId, userName, userEmail }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    resume: "",
    coverLetter: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.resume) {
      toast.error("Please upload your resume");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/applications", {
        jobId,
        applicantId: userId,
        name: userName,
        email: userEmail,
        resume: formData.resume,
        coverLetter: formData.coverLetter,
      });

      toast.success("Application submitted successfully!");
      setOpen(false);
      // Reset form after successful submission
      setFormData({
        resume: "",
        coverLetter: "",
      });
    } catch (error) {
      console.error("Application error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Apply Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for this position</DialogTitle>
          <DialogDescription>
            Fill out the form below to submit your application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Resume*</Label>
            <FileUpload
              onUpload={({ url, filename }) =>
                setFormData({
                  ...formData,
                  resume: url,
                  resumeFilename: filename,
                })
              }
              disabled={loading}
            />
            {!formData.resume && (
              <p className="text-xs text-red-500">Resume is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              placeholder="Tell the employer why you're a good fit..."
              rows={5}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.resume}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
