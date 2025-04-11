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
  Edit2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

export default function JobDetailPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    deadline: "",
    tags: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch job");
        }

        setJob(data.data);
        setEditData({
          title: data.data.title,
          company: data.data.company,
          location: data.data.location,
          salary: data.data.salary,
          description: data.data.description,
          deadline: data.data.deadline
            ? new Date(data.data.deadline).toISOString().slice(0, 16)
            : "",
          tags: data.data.tags?.join(", ") || "",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editData,
          salary: Number(editData.salary),
          tags: editData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update job");
      }

      setJob(data.data);
      toast.success("Job updated successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    // Make sure you're receiving just the ID
    try {
      toast.info("Deleting job...");

      const response = await fetch(`/api/jobs/${jobId}`, {
        // Pass only the ID
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete job");
      }

      const result = await response.json();
      toast.success(result.message);
      router.refresh(); // Refresh the page
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete job");
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
          onClick={() => router.push("/employerdashboard")}
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
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col md:flex-row justify-end gap-4 p-6 border-t">
          <Button
            onClick={() => handleDeleteJob(job._id)} // NOT job or job.id.toString()
            variant="destructive"
          >
            Delete Job
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <CardFooter className="flex flex-col md:flex-row justify-end gap-4 p-6 border-t">
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          </DialogTrigger>
          <Button
            onClick={() =>
              router.push(`/employerdashboard/${jobId}/applications`)
            }
          >
            <Users className="h-4 w-4 mr-2" />
            View Applications
          </Button>
        </CardFooter>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>
              Make changes to your job posting here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Job Title
              </Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                value={editData.company}
                onChange={(e) =>
                  setEditData({ ...editData, company: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salary ($)
              </Label>
              <Input
                id="salary"
                type="number"
                value={editData.salary}
                onChange={(e) =>
                  setEditData({ ...editData, salary: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={editData.deadline}
                onChange={(e) =>
                  setEditData({ ...editData, deadline: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={editData.tags}
                onChange={(e) =>
                  setEditData({ ...editData, tags: e.target.value })
                }
                placeholder="Comma separated tags"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="col-span-3 h-40"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          onClick={() => router.push("/employerdashboard")}
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
          <Button onClick={() => router.push("/employerdashboard")}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
