// app/privacy-policy/page.js
"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Shield, Lock, Server, Mail, ArrowRight } from "lucide-react";
  import { Separator } from "@/components/ui/separator";
  import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
  
  export default function PrivacyPolicyPage() {
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
    const policySections = [
      {
        icon: <Shield className="h-6 w-6" />,
        title: "Information We Collect",
        content: (
          <>
            <p className="mb-4">We collect information to provide better services to all our users. The types of information we collect include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and other profile information.</li>
              <li><strong>Usage Data:</strong> We collect information about how you interact with our platform, including pages visited and features used.</li>
              <li><strong>Application Data:</strong> For job applicants, we store resume information, work history, and application materials.</li>
              <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience.</li>
            </ul>
          </>
        )
      },
      {
        icon: <Lock className="h-6 w-6" />,
        title: "How We Use Information",
        content: (
          <>
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To personalize your experience and match you with relevant job opportunities</li>
              <li>To communicate with you about your account and our services</li>
              <li>To ensure the security and integrity of our platform</li>
              <li>To comply with legal obligations and prevent fraud</li>
            </ul>
          </>
        )
      },
      {
        icon: <Server className="h-6 w-6" />,
        title: "Data Sharing & Disclosure",
        content: (
          <>
            <p className="mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>With Employers:</strong> When you apply for jobs, your application materials are shared with the relevant employer.</li>
              <li><strong>Service Providers:</strong> We may share data with trusted third parties who assist us in operating our platform.</li>
              <li><strong>Legal Compliance:</strong> When required by law or to protect our rights and the rights of others.</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition.</li>
            </ul>
          </>
        )
      },
      {
        icon: <Mail className="h-6 w-6" />,
        title: "Your Rights & Choices",
        content: (
          <>
            <p className="mb-4">You have certain rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Access & Correction:</strong> You can review and update your account information at any time.</li>
              <li><strong>Data Deletion:</strong> You may request deletion of your personal data, subject to certain exceptions.</li>
              <li><strong>Communication Preferences:</strong> You can opt out of promotional communications.</li>
              <li><strong>Cookies:</strong> Most browsers allow you to control cookies through their settings.</li>
            </ul>
          </>
        )
      }
    ];
  
    return (
        <>
        <Navbar isLoggedIn={login} />
      <div className="container mx-auto px-4 mt-10 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="max-w-3xl mx-auto">
            We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
          </p>
        </section>
  
        <Separator />
  
        {/* Policy Sections */}
        <section className="space-y-12">
          {policySections.map((section, index) => (
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
          <h2 className="text-2xl font-bold">Additional Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>International Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your information may be transferred to and maintained on computers located outside of your country, where privacy laws may differ.</p>
              </CardContent>
            </Card>
          </div>
        </section>
  
        <Separator />
  
        {/* Contact & Updates */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Have Questions?</h2>
          <p className="max-w-2xl mx-auto">
            If you have any questions about our Privacy Policy or data practices, please contact us.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/terms-of-use">
                View Terms of Service <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm max-w-2xl mx-auto">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </section>
      </div>
      </>
    );
  }