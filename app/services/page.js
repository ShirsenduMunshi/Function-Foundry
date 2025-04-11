"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  Rocket,
  ShieldCheck,
  BarChart,
  FileSearch,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function ServicesPage() {
  const [login, setLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const User = JSON.parse(localStorage.getItem("authToken")) || null;


  useEffect(() => {
    // Safely access localStorage after the component mounts
    const authToken = localStorage.getItem("authToken");
    const User = authToken ? JSON.parse(authToken) : null;

    if (User?.token?.user?.email) {
      setLogin(true);
    }
  }, []); // Empty dependency array ensures this runs only once after mount

  const services = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Job Matching",
      description:
        "Our advanced algorithm matches candidates with the most suitable job opportunities based on skills, experience, and preferences.",
      features: [
        "AI-powered recommendations",
        "Personalized job feed",
        "Skill gap analysis",
      ],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Recruitment Solutions",
      description:
        "Comprehensive hiring tools for employers to find and attract top talent efficiently.",
      features: [
        "Candidate screening",
        "Employer branding",
        "Interview scheduling",
      ],
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Quick Apply",
      description:
        "One-click application system with smart resume parsing for faster submissions.",
      features: [
        "Profile auto-completion",
        "Application tracking",
        "Instant notifications",
      ],
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Verified Profiles",
      description:
        "Trusted network of authenticated candidates and employers.",
      features: [
        "Background verification",
        "Skill assessments",
        "Company validation",
      ],
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Career Analytics",
      description:
        "Data-driven insights to help candidates understand their market value.",
      features: [
        "Salary benchmarking",
        "Skill demand analysis",
        "Career growth projections",
      ],
    },
    {
      icon: <FileSearch className="h-8 w-8" />,
      title: "Resume Optimization",
      description:
        "Professional tools to craft resumes that get noticed by employers.",
      features: [
        "ATS compatibility check",
        "Design templates",
        "Content suggestions",
      ],
    },
  ];

  const testimonials = [
    {
      quote:
        "This platform helped me find my dream job in just two weeks! The matching system is incredible.",
      author: "Sarah K., Software Engineer",
    },
    {
      quote:
        "As an employer, we've reduced our hiring time by 40% while improving candidate quality.",
      author: "Michael T., HR Director",
    },
    {
      quote:
        "The resume builder alone was worth signing up for. Got 3x more interviews after using it.",
      author: "David P., Marketing Specialist",
    },
  ];

  return (
    <>
      <Navbar isLoggedIn={login} />
      <div className="container mx-auto mt-10 px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Comprehensive solutions designed to bridge the gap between talent
            and opportunity. Whether you're job seeking or hiring, we have the
            tools to help you succeed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/joblist">
                Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {User?.token?.user?.role === "employer" && (<Button variant="outline" asChild>
              <Link href="/employerdashboard">
                Hiring Solutions <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>)}
          </div>
        </section>

        <Separator />

        {/* Services Grid */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center">
            How We Help You Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full">{service.icon}</div>
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <BadgeCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Testimonials */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <blockquote className="space-y-4">
                    <p className="italic">"{testimonial.quote}"</p>
                    <footer className="font-medium">{testimonial.author}</footer>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* CTA Section */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold">
            Ready to Transform Your Career or Hiring Process?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/signup">
                Join as Candidate <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">
                Hire Talent <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}