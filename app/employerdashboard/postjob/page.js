"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    tags: "",
    deadline: "",
    logo: null
  });
  const [employerId, setEmployerId] = useState(null); // Add this state
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    // Get employer ID when component mounts
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const userData = JSON.parse(authToken);
      if (userData?.token?.user?._id) {
        setEmployerId(userData.token.user._id);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear date error when typing
    if (name === "deadline") setDateError("");
  };

  const validateDate = (dateString) => {
    if (!dateString) return "Deadline is required";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date format";
    if (date < new Date()) return "Deadline must be in the future";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date first
    const dateValidation = validateDate(formData.deadline);
    if (dateValidation) {
      setDateError(dateValidation);
      toast.error(dateValidation);
      return;
    }
  
    setIsSubmitting(true);
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("company", formData.company);
    data.append("location", formData.location);
    data.append("salary", formData.salary);
    data.append("description", formData.description);
    data.append("employer", employerId); // Use the state value
    data.append("deadline", formData.deadline);
    
    // Send tags as comma-separated string (don't JSON.stringify)
    data.append("tags", formData.tags);
  
    if (formData.logo) {
      data.append("logo", formData.logo);
    }
  
    try {
      const response = await axios.post("/api/jobs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("Job posted successfully!");
      router.push("/employerdashboard");
    } catch (error) {
      console.error("Posting error:", error);
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto mt-12 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Post New Job Opening
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company*</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location*</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (USD)*</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline*</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={dateError ? "border-red-500" : ""}
                />
                {dateError && (
                  <p className="text-sm text-red-500">{dateError}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="React, Full-time, Remote"
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description*</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, logo: e.target.files[0] }));
                  setFileName(e.target.files[0]?.name || "");
                }}
              />
              {fileName && (
                <p className="text-sm text-muted-foreground">
                  Selected: {fileName}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}