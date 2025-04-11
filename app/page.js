"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SiTheboringcompany } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar"; // Import the Navbar component
import { Skeleton } from "@/components/ui/skeleton";
import ApplyDialog from "@/components/ApplyDialog";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userD, setUserD] = useState({});

  const logos = [
    "/clogo1.png",
    "/clogo2.png",
    "/clogo3.png",
    "/clogo4.png",
    "/clogo5.webp",
    "/clogo6.png",
  ];

  useEffect(() => {
    // Check if the user is logged in
    const authUser = localStorage.getItem("authToken");
    if (authUser) {
      const user = JSON.parse(authUser);
      if (user?.token?.user?.email) {
        setIsLoggedIn(true);
      }
      setUserD(user.token.user);
    }

    // Fetch jobs
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/fetchjobs");
        // console.log(response?.data?.allJobs);
        console.log(response);
        setJobs(response?.data?.allJobs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="p-4 hero-background w-full flex flex-col items-center justify-between">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mt-20 h-[50svh] flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Welcome to Function Foundry
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Where Talent Takes Shape – Find your dream job or hire top talent
            today.
          </p>
          {isLoggedIn ? (
            <div className="mt-6 flex gap-4 justify-center">
              <Link href="/joblist">
                <Button className="px-6 py-3">Find a Job</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex gap-4 justify-center">
              <Link href="/login">
                <Button className="px-6 py-3">Login</Button>
              </Link>
              <Link href="signup">
                <Button variant="outline" className="px-6 py-3">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Scrolling Logos Section */}
        <div className="w-full overflow-hidden py-2">
          <motion.div
            className="flex whitespace-nowrap items-center"
            animate={{ x: [0, "-50%"] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt={`logo-${index}`}
                className="h-[200px] w-[200px] object-contain mx-4"
              />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mt-12 mx-auto w-full max-w-5xl">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Latest Job Listings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0
            ? jobs
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6)
                .map((job) => (
                  <Card
                    key={job?._id}
                    className="p-4 shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CardHeader className="flex items-center gap-4">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          className="h-12 w-12 object-contain rounded-md"
                          alt={`${job.company} logo`}
                        />
                      ) : (
                        <SiTheboringcompany className="h-12 w-12 opacity-60" />
                      )}
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {job.title}
                        </CardTitle>
                        <Separator />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      <p className="font-medium">{job.company}</p>
                      <p className="text-sm opacity-80">
                        Job Location: {job.location}
                      </p>
                      {isLoggedIn ? (
                        <ApplyDialog
                          jobId={job._id}
                          userId={userD._id}
                          userName={userD.name}
                          userEmail={userD.email}
                        />
                      ) : (
                        <Link href="/login">
                          <Button className="w-full">Login to Apply</Button>
                        </Link>
                      )}
                      <Link href={`/candidatedashboard/${job._id}`}>
                          <Button variant="outline" className="w-full">View Details</Button>
                        </Link>
                    </CardContent>
                  </Card>
                ))
            : // Skeleton loader for a better UI experience
              [...Array(3)].map((_, index) => (
                <Card key={index} className="p-4 shadow-lg">
                  <CardHeader className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Separator />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </>
  );
}
