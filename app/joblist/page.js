"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { SiTheboringcompany } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import ApplyDialog from "@/components/ApplyDialog";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Banknote, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function JobListPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userD, setUserD] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authUser = localStorage.getItem("authToken");
    if (authUser) {
      const user = JSON.parse(authUser);
      if (user?.token?.user?.email) {
        setIsLoggedIn(true);
      }
      setUserD(user.token.user);
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/fetchjobs");
        setJobs(response?.data?.allJobs);
      } catch (error) {
        console.error(error);
        setError("Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Jobs</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="container mx-auto my-6 px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Career Opportunities</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse through our latest job openings and find your perfect career match.
          </p>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((job) => (
                <Card key={job._id} className="h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          className="h-12 w-12 object-contain rounded-md"
                          alt={`${job.company} logo`}
                        />
                      ) : (
                        <SiTheboringcompany className="h-12 w-12 opacity-60 mt-1" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="text-base">
                          {job.company}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm">
                          <Banknote className="h-4 w-4 mr-2" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        <span>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link href={`/candidatedashboard/${job._id}`}>
                      <Button variant={"outline"} className="w-full">View Detail</Button>
                    </Link>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.requirements?.slice(0, 3).map((req, i) => (
                        <Badge key={i} variant="outline">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements?.length > 3 && (
                        <Badge variant="outline">+{job.requirements.length - 3} more</Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    {isLoggedIn ? (
                      <ApplyDialog
                        jobId={job._id}
                        userId={userD._id}
                        userName={userD.name}
                        userEmail={userD.email}
                        className="w-full"
                      />
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/login">Sign in to apply</Link>
                      </Button>
                    )}
                    
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          <Alert>
            <AlertTitle>No job listings available</AlertTitle>
            <AlertDescription>
              There are currently no open positions. Please check back later.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </>
  );
}