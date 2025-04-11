// app/about/page.js
"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    Users,
    Briefcase,
    Rocket,
    ShieldCheck,
    BarChart2,
    HeartHandshake,
    ArrowRight,
  } from "lucide-react";
  import { Separator } from "@/components/ui/separator";
  import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
  
  export default function AboutPage() {
    const features = [
      {
        icon: <Briefcase className="h-8 w-8" />,
        title: "Job Matching",
        description: "Smart algorithms connect candidates with perfect job opportunities based on skills and preferences.",
      },
      {
        icon: <Rocket className="h-8 w-8" />,
        title: "Quick Applications",
        description: "One-click apply system with resume parsing for faster job applications.",
      },
      {
        icon: <ShieldCheck className="h-8 w-8" />,
        title: "Trusted Network",
        description: "Verified companies and candidates ensure authentic opportunities and applications.",
      },
      {
        icon: <BarChart2 className="h-8 w-8" />,
        title: "Career Insights",
        description: "Detailed analytics help candidates understand their market value and skills demand.",
      },
      {
        icon: <HeartHandshake className="h-8 w-8" />,
        title: "Employer Support",
        description: "Dedicated tools for employers to find and manage top talent efficiently.",
      },
      {
        icon: <Users className="h-8 w-8" />,
        title: "Community",
        description: "Networking opportunities and professional development resources.",
      },
    ];
  
    const stats = [
      { value: "10,000+", label: "Active Jobs" },
      { value: "50,000+", label: "Successful Hires" },
      { value: "5,000+", label: "Trusted Companies" },
      { value: "98%", label: "Satisfaction Rate" },
    ];
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const user = JSON.parse(localStorage.getItem("authToken"));

      useEffect(() => {
          // Check if the user is logged in
          const authUser = localStorage.getItem("authToken");
          if (authUser) {
            const user = JSON.parse(authUser);
            if (user?.token?.user?.email) {
              setIsLoggedIn(true);
            }
          }
        });
      
    return (
    <>
      <Navbar isLoggedIn={isLoggedIn}/>
      <div className="container mx-auto mt-10 px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Connecting Talent with Opportunity
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            Our platform bridges the gap between ambitious professionals and innovative companies. 
            We're revolutionizing the hiring process with technology that works for everyone.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/joblist">
                Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {user?.role === "employer" && (
                <Button variant="outline" asChild>
                <Link href="/employerdashboard">
                    For Employers <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
            )}
          </div>
        </section>
  
        <Separator />
  
        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p>
              To create a more efficient, transparent, and equitable job market where talent meets opportunity 
              without barriers. We believe everyone deserves meaningful work and every company deserves 
              the right talent.
            </p>
            <p>
              Founded in 2023, our platform has grown to serve professionals and employers across multiple 
              industries, with a focus on quality connections over quantity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
                <CardDescription>{stat.label}</CardDescription>
              </Card>
            ))}
          </div>
        </section>
  
        <Separator />
  
        {/* Features Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Why Choose Our Platform</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
  
        <Separator />
  
        {/* Team Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Our Leadership</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Shirsendu Munshi",
                role: "CEO & Founder",
                bio: "Former HR tech executive with 15 years of industry experience.",
              },
              {
                name: "Rudranath Mukherjee",
                role: "CTO & Co-Founder",
                bio: "Tech visionary with a passion for AI and machine learning.",
              },
              {
                name: "Shresthi kormokar",
                role: "Head of Product",
                bio: "User experience expert focused on creating seamless workflows.",
              },
            ].map((person, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{person.name}</CardTitle>
                  <CardDescription>{person.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{person.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
  
        {/* CTA Section */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Ready to Transform Your Career or Hiring?</h2>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
    );
  }