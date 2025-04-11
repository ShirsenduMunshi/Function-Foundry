"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Mail,
  User,
  CalendarDays,
  BadgeCheck,
  Clock,
  X,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const statusVariants = {
  pending: { text: "Pending", color: "bg-yellow-500" },
  reviewed: { text: "Reviewed", color: "bg-blue-500" },
  rejected: { text: "Rejected", color: "bg-red-500" },
  accepted: { text: "Accepted", color: "bg-green-500" },
};

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}/applications`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        setApplications(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleDeleteApplication = async (applicationId) => {
    console.log("Application Id for delete:", applicationId);
    const approve = prompt("Are you sure you want to delete this application? (y/n)", "n");
    if (approve !== "y") {
      toast.error("Deletion cancelled");
      return;
    }
    try {
      toast.info("Deleting application...");

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // First check if we got any response
      if (!response) {
        throw new Error("No response from server - check network connection");
      }

      // Get the response text first for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Try to parse as JSON if possible
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error(responseText || "Failed to process server response");
      }

      // Check if response was successful
      if (!response.ok) {
        throw new Error(
          data.message || `Delete failed with status ${response.status}`
        );
      }

      // Verify the deletion was successful
      if (!data.success) {
        throw new Error(data.message || "Deletion not confirmed by server");
      }

      // Update UI state
      setApplications((prev) =>
        prev.filter((app) => app._id !== applicationId)
      );
      toast.success(data.message || "Application deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete application");
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update application status");
      }

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success("Application status updated!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message);
    }
  };

  const handleDownloadResume = async (applicationId, applicantName) => {
    console.log("Application Id for download:", applicationId);
    try {
      toast.info('Preparing resume download...');
      
      if (!applicationId) {
        throw new Error('No application specified');
      }
      
      // const response = await fetch(`/api/applications/download/${applicationId}`);
      const response = await fetch(`/api/applications/download/${applicationId}`);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to prepare download');
      }
  
      const { url, filename } = await response.json();
  
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `resume_${applicantName.replace(/\s+/g, '_')}.pdf`;
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
  
      toast.success('Resume download started!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(`Download error: ${error.message}`);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} router={router} />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/employerdashboard/${jobId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardHeader className="text-center p-12">
            <div className="space-y-4">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <CardTitle className="text-xl">No Applications Yet</CardTitle>
              <CardDescription>
                No one has applied to this job yet.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application._id}>
              <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">{application.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={statusVariants[application.status].color}>
                      {statusVariants[application.status].text}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Applied on{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-col mg:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(application._id, "pending")
                    }
                    disabled={application.status === "pending"}
                  >
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(application._id, "accepted")
                    }
                    disabled={application.status === "accepted"}
                  >
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    Accept
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(application._id, "reviewed")
                    }
                    disabled={application.status === "reviewed"}
                  >
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    Reviewed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(application._id, "rejected")
                    }
                    disabled={application.status === "rejected"}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{application.email}</span>
                    </div>
                    {application.coverLetter && (
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Cover Letter</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteApplication(application._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleDownloadResume(
                          application._id.toString(),
                          application.name
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-8 w-48" />
      </div>

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-16 w-full mt-2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ error, router }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/employerdashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
      </div>

      <Card>
        <CardHeader className="text-center p-12">
          <div className="space-y-4">
            <User className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle className="text-xl">
              Error Loading Applications
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
