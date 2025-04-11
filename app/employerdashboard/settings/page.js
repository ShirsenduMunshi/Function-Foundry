"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


const SettingsPage = () => {
  const [userData, setUserData] = useState({
    profilePic: "",
    name: "",
    email: "",
    role: "",
    mongoDBId: ""
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");
        
        const jsonToken = JSON.parse(token);
        const user = jsonToken?.token?.user;
        
        if (!user) throw new Error("User data not found in token");
        
        setUserData({
          profilePic: user?.profile?.profilePicture || "",
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          mongoDBId: user._id || ""
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let updatedData = { ...userData };
      
      // Upload new image if selected
      if (selectedFile) {
        const imageUrl = await uploadImage(selectedFile);
        updatedData.profilePic = imageUrl;
      }
      
      // Update user data
      await updateUserData(updatedData);
      
      // Reset temp states
      setTempImage(null);
      setSelectedFile(null);
      setIsDialogOpen(false);
      
      // Show success feedback
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={userData.profilePic} 
              alt={userData.name} 
            />
            <AvatarFallback className="text-2xl">
              {userData.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{userData.name}</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">MongoDB User ID</p>
              <p className="text-sm">{userData.mongoDBId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm">{userData.email}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Role</p>
            <p className="text-sm">{userData.role}</p>
          </div>
        </CardContent>

        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={tempImage || userData.profilePic} 
                      alt="Preview" 
                    />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                  <Input
                    name="name"
                    label="Full Name"
                    value={userData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Non-editable Fields */}
                <div className="space-y-2">
                  <Input
                    label="User ID"
                    value={userData.mongoDBId}
                    disabled
                  />
                  <Input
                    label="Role"
                    value={userData.role}
                    disabled
                  />
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

// Mock function - replace with your actual API call
async function updateUserData(data) {
  console.log("Updating user data:", data);
  // Example implementation:
  // const response = await fetch('/api/users/update', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return await response.json();
}

export default SettingsPage;