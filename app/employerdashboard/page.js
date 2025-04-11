"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SiTheboringcompany } from "react-icons/si";
import { format } from "date-fns";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation'; // Added useRouter import

const EmployerDashboard = () => {
  const formatDate = (dateString) => {
    // Return early if no date provided
    if (!dateString) return "No deadline set";

    try {
      const date = new Date(dateString);

      // Check if date is invalid
      if (isNaN(date.getTime())) {
        return "Invalid date format";
      }

      // Format valid date
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date error";
    }
  };

  const router = useRouter(); // Initialize router
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const authUser = localStorage.getItem("authToken");
        if (!authUser) return console.error("User not logged in");

        const user = JSON.parse(authUser);
        const employerId = user?.token?.user?._id;

        if (!employerId) return console.error("Employer ID missing");

        const response = await axios.get(`/api/jobs?employerId=${employerId}`);
        setJobs(response.data.allJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Manage your job postings and track applications
        </p>
        <Separator />
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter((job) => new Date(job.deadline) > new Date()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Jobs</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                jobs.filter((job) => new Date(job.deadline) <= new Date())
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Job Postings
          </h2>
          <Link href="/employerdashboard/postjob/"><Button>Post New Job</Button></Link>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardFooter>
              </Card>
            ))
          ) : jobs.length > 0 ? (
            jobs
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((job) => (
                <Card
                  key={job._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="flex flex-row items-start space-x-4 space-y-0">
                    {job.logo ? (
                      <img
                        src={job.logo}
                        className="h-12 w-12 object-contain rounded-md"
                        alt={`${job.company} logo`}
                      />
                    ) : (
                      <div className="p-2 rounded-md border">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                      <Badge
                        variant={
                          new Date(job.deadline) > new Date()
                            ? "default"
                            : "secondary"
                        }
                      >
                        {new Date(job.deadline) > new Date()
                          ? "Active"
                          : "Expired"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Posted:{" "}
                        {format(new Date(job.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex space-x-2">
                    <Button variant="outline" className="flex-1" onClick={() => router.push(`/employerdashboard/${job._id}/applications`)}>
                      View Applicants
                    </Button>
                    <Button className="flex-1"onClick={() => router.push(`/employerdashboard/${job._id}`)}>Manage Job</Button>
                  </CardFooter>
                </Card>
              ))
          ) : (
            <div className="col-span-full text-center py-12 space-y-4">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No jobs posted yet</h3>
              <p className="text-muted-foreground">
                Get started by posting your first job opening
              </p>
              <Button className="mt-4">Post a Job</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EmployerDashboard;
