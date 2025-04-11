"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  Briefcase,
  ArrowLeft,
  Users,
  FileText,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        setUser(parsedToken?.token?.user || null);
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }

    const fetchJobAndApplication = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const jobResponse = await fetch(`/api/jobs/${jobId}`);
        const jobData = await jobResponse.json();

        if (!jobResponse.ok || !jobData.success) {
          throw new Error(jobData.message || "Failed to fetch job");
        }

        setJob(jobData.data);

        // If user is logged in, check if they've applied
        if (authToken) {
          const userId = JSON.parse(authToken)?.token?.user?._id;
          if (userId) {
            const applicationResponse = await fetch(
              `/api/applications/status?jobId=${jobId}&applicantId=${userId}`
            );
            const applicationData = await applicationResponse.json();
            
            if (applicationResponse.ok && applicationData.success) {
              setApplicationStatus(applicationData.status);
            }
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplication();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(authToken)?.token?.user;
      if (!userData?._id) {
        throw new Error("User information not available");
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify({
          jobId,
          applicantId: userData._id,
          name: userData.name,
          email: userData.email,
          // You might want to add resume and cover letter handling here
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to apply for job");
      }

      setApplicationStatus('pending');
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);
      toast.error(error.message);
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
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="shrink-0">
              {job?.logo ? (
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-20 h-20 object-contain rounded-lg border"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center rounded-lg border">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {job?.title || "No title"}
              </CardTitle>
              <CardDescription className="text-lg">
                {job?.company || "No company specified"}
              </CardDescription>
              {job?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  Position Details
                </h3>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Location:</span>{" "}
                    {job?.location || "Not specified"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Salary:</span>{" "}
                    {job?.salary
                      ? `$${job.salary.toLocaleString()}/month`
                      : "Not specified"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Employment Type:</span>{" "}
                    {job?.location || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Timeline
                </h3>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Posted:</span>{" "}
                    {job?.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Deadline:</span>{" "}
                    {job?.deadline
                      ? new Date(job.deadline).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Job Description</h3>
                <Separator />
                <p className="text-sm whitespace-pre-line">
                  {job?.description || "No description provided"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Requirements</h3>
                <Separator />
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {job?.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  )) || <li>No specific requirements listed</li>}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  function LoadingSkeleton() {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>
  
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </CardHeader>
  
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
        </div>
  
        <Card>
          <CardHeader className="text-center p-12">
            <div className="space-y-4">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
              <CardTitle className="text-xl">Job Not Found</CardTitle>
              <CardDescription>{error}</CardDescription>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/jobs')}>
              Browse Other Jobs
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}