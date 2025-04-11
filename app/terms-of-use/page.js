// app/terms-of-use/page.js
"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    FileText,
    AlertCircle,
    UserCheck,
    Shield,
    Globe,
    ArrowRight,
  } from "lucide-react";
  import { Separator } from "@/components/ui/separator";
  import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
  
  export default function TermsOfUsePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
         const [login, setLogin] = useState(false);
          const User = JSON.parse(localStorage.getItem("authToken")) || null;
        
        
          useEffect(() => {
            // Safely access localStorage after the component mounts
            const authToken = localStorage.getItem("authToken");
            const User = authToken ? JSON.parse(authToken) : null;
        
            if (User?.token?.user?.email) {
              setLogin(true);
            }
          }, []); 

    const termsSections = [
      {
        icon: <FileText className="h-6 w-6" />,
        title: "Acceptance of Terms",
        content: (
          <>
            <p className="mb-4">
              By accessing or using our platform, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree with any part of these terms, you may not use our services.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </>
        )
      },
      {
        icon: <UserCheck className="h-6 w-6" />,
        title: "User Accounts",
        content: (
          <>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to provide accurate and complete information</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </>
        )
      },
      {
        icon: <AlertCircle className="h-6 w-6" />,
        title: "Prohibited Conduct",
        content: (
          <>
            <p className="mb-4">When using our platform, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Violate any laws or third-party rights</li>
              <li>Use the platform for any illegal or unauthorized purpose</li>
              <li>Harass, discriminate, or harm other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to scrape or extract data</li>
            </ul>
          </>
        )
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "Intellectual Property",
        content: (
          <>
            <p className="mb-4">
              All content on this platform, including text, graphics, logos, and software, is our property or the property of our licensors and is protected by intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works without our express permission. Job postings and candidate profiles may only be used for their intended purpose.
            </p>
          </>
        )
      },
      {
        icon: <Globe className="h-6 w-6" />,
        title: "Third-Party Content",
        content: (
          <>
            <p className="mb-4">
              Our platform may contain links to third-party websites or services. We are not responsible for the content or practices of these third parties.
            </p>
            <p>
              When you apply for jobs through our platform, you may be directed to employer sites or third-party application systems with their own terms and policies.
            </p>
          </>
        )
      }
    ];
  
    return (
      <>
       <Navbar isLoggedIn={login} />
        <div className="container mx-auto mt-10 px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Use</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="max-w-3xl mx-auto">
            These terms govern your use of our platform. Please read them carefully.
          </p>
        </section>
  
        <Separator />
  
        {/* Terms Sections */}
        <section className="space-y-12">
          {termsSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full">
                    {section.icon}
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
            </Card>
          ))}
        </section>
  
        <Separator />
  
        {/* Additional Information */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Additional Provisions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent>
                <p>The platform is provided "as is" without warranties of any kind. We do not guarantee the accuracy of job postings or candidate profiles, or that the platform will be uninterrupted or error-free.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
              </CardContent>
            </Card>
          </div>
        </section>
  
        <Separator />
  
        {/* Governing Law & Contact */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Governing Law</h2>
          <p className="max-w-2xl mx-auto">
            These terms shall be governed by the laws of [Your Jurisdiction] without regard to its conflict of law provisions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy-policy">
                View Privacy Policy <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
      </>
    );
  }