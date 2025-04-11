// app/clientdashboard/page.js
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Clock, CheckCircle, FileText, Settings } from "lucide-react";
import ApplicationsTable from "./components/ApplicationsTable";
import ProfileSection from "./components/ProfileSection";

export default function ClientDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your job applications and profile
        </p>
      </header>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="applications">
            <Briefcase className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="profile">
            <Settings className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileSection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}