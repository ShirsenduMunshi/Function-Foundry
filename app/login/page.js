"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // Call the login API
      const response = await axios.post("/api/auth/login", { email, password });
      // Show success message
      toast("Login successful", { variant: "success" });
      // Log the response and verify the data
      console.log("Login response:", response.data);
      // Store the token and role in localStorage
      const tokenData = {
        token: response?.data,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // Current time + 1 day
      };

      localStorage.setItem("authToken", JSON.stringify(tokenData));

      // Redirect based on the user's role
      const role = response?.data?.user?.role;
      if (role === "employer") {
        console.log("Redirecting to /employer-dashboard...");
        router.push("/employerdashboard");
      } else if (role === "candidate") {
        console.log("Redirecting to /candidate-dashboard...");
        router.push("/candidatedashboard");
      } else {
        console.log("Unknown role, redirecting to /dashboard...");
        router.push("/problem");
      }
    } catch (error) {
      // Show error message
      toast(error.response?.data?.message || "Failed to login", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="text-center text-lg font-semibold">Login</CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" autoComplete="user email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" autoComplete="password" required />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}