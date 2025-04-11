"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Loader2, Save, Key, User, Pencil, Upload, X } from "lucide-react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSection() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    _id: "",
    role: "",
    profile: {
      bio: "",
      profilePicture: "",
      resume: "",
      skills: [],
    },
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [emailChangeData, setEmailChangeData] = useState({
    newEmail: "",
    currentPassword: "",
  });
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          window.location.href = "/login";
          return;
        }

        const user = JSON.parse(authToken);
        const userId = user?.token?.user?._id;

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            Authorization: authToken,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const userDataFromDB = await response.json();

        setUserData({
          name: userDataFromDB.name || "",
          email: userDataFromDB.email || "",
          _id: userDataFromDB._id || "",
          role: userDataFromDB.role || "",
          profile: {
            bio: userDataFromDB?.profile?.bio || "",
            profilePicture: userDataFromDB?.profile?.profilePicture || "",
            resume: userDataFromDB?.profile?.resume || "",
            skills: userDataFromDB?.profile?.skills || [],
          },
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast("Error");
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ... (keep all your existing handler functions unchanged)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Validate password length
      if (passwordData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      const authToken = localStorage.getItem("authToken");
      const userId = userData._id;

      const response = await fetch(`/api/users/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update password");
      }

      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        router.push("/login");
        return;
      }

          // Filter out any empty skills that might have slipped through
      const validSkills = userData.profile.skills.filter(skill => 
        skill.trim() !== ""
      );


      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("bio", userData.profile.bio);
      formData.append("skills", JSON.stringify(validSkills)); // Only send valid skills


      if (userData.profile.profilePicture) {
        formData.append(
          "existingProfilePicture",
          userData.profile.profilePicture
        );
      }

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const response = await fetch(`/api/users/${userData._id}`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();

      setUserData(result.user);
      toast.success("Profile updated successfully");
      setEditMode(false);
      setSelectedFile(null);
      setFilePreview("");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setIsChangingEmail(true);

    try {
      // Validate new email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailChangeData.newEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const authToken = localStorage.getItem("authToken");
      const userId = userData._id;

      const response = await fetch(`/api/users/${userId}/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          newEmail: emailChangeData.newEmail,
          currentPassword: emailChangeData.currentPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update email");
      }

      const result = await response.json();

      // Update local storage and state
      const updatedUser = JSON.parse(authToken);
      updatedUser.token.user.email = emailChangeData.newEmail;
      localStorage.setItem("authToken", JSON.stringify(updatedUser));

      setUserData((prev) => ({
        ...prev,
        email: emailChangeData.newEmail,
      }));

      toast.success("Email updated successfully");
      setEmailChangeData({
        newEmail: "",
        currentPassword: "",
      });
    } catch (error) {
      console.error("Email update error:", error);
      toast.error(error.message);
    } finally {
      setIsChangingEmail(false);
    }
  };

  const removeSkill = (index) => {
    setUserData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter((_, i) => i !== index),
      },
    }));
  };

  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const skill = e.target.value.trim();

      // Validate skill is not empty and not just whitespace
      if (skill && !userData.profile.skills.includes(skill)) {
        setUserData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            skills: [...prev.profile.skills, skill],
          },
        }));
        e.target.value = ""; // Clear input only if skill was added
      } else if (!skill) {
        toast.error("Please enter a valid skill");
      } else {
        toast.error("Skill already exists");
      }
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-28" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-9 w-36" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-32 ml-auto" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-32 ml-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex md:flex-row lg:flex-row lg:items-center md:items-center md:justify-between lg:justify-between justify-center items-baseline gap-2 flex-col">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal details and preferences
            </CardDescription>
          </div>
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => setEditMode(!editMode)}
            className="shrink-0"
          >
            {editMode ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate}>
            <div className="grid gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={filePreview || userData.profile.profilePicture}
                    alt="Profile picture"
                  />
                  <AvatarFallback>
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {editMode && (
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label htmlFor="profilePicture">
                      <Button variant="outline" size="sm" asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </div>
                      </Button>
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {selectedFile && (
                      <span className="text-sm text-center sm:text-left">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Input id="role" value={userData.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input id="userId" value={userData._id} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={userData.profile.bio}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      profile: { ...userData.profile, bio: e.target.value },
                    })
                  }
                  disabled={!editMode}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                {editMode ? (
                  <>
                    <Input
                      id="skills"
                      placeholder="Type a skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill(e);
                        }
                      }}
                      disabled={!editMode}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userData.profile.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="rounded-full p-0.5 hover:bg-accent"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userData.profile.skills.length > 0 ? (
                      userData.profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No skills added
                      </span>
                    )}
                  </div>
                )}
              </div>

              {editMode && (
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Change Email Address
          </CardTitle>
          <CardDescription>
            Update your account's email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailChange}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentEmail">Current Email</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={userData.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailChangeData.newEmail}
                  onChange={(e) =>
                    setEmailChangeData({
                      ...emailChangeData,
                      newEmail: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailPassword">Confirm Password</Label>
                <Input
                  id="emailPassword"
                  type="password"
                  value={emailChangeData.currentPassword}
                  onChange={(e) =>
                    setEmailChangeData({
                      ...emailChangeData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isChangingEmail}>
                  {isChangingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Email"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    });
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  required
                  minLength={8}
                />
                {passwordData.newPassword && (
                  <div className="mt-1">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-sm ${
                            i <= passwordStrength
                              ? passwordStrength >= 3
                                ? "bg-green-500"
                                : passwordStrength >= 2
                                ? "bg-yellow-500"
                                : "bg-red-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Password should contain:
                      <ul className="list-disc pl-4">
                        <li
                          className={
                            passwordData.newPassword.length >= 8
                              ? "text-green-500"
                              : ""
                          }
                        >
                          At least 8 characters
                        </li>
                        <li
                          className={
                            /[A-Z]/.test(passwordData.newPassword)
                              ? "text-green-500"
                              : ""
                          }
                        >
                          At least one uppercase letter
                        </li>
                        <li
                          className={
                            /[0-9]/.test(passwordData.newPassword)
                              ? "text-green-500"
                              : ""
                          }
                        >
                          At least one number
                        </li>
                        <li
                          className={
                            /[^A-Za-z0-9]/.test(passwordData.newPassword)
                              ? "text-green-500"
                              : ""
                          }
                        >
                          At least one special character
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                {passwordData.newPassword && passwordData.confirmPassword && (
                  <p
                    className={`text-xs ${
                      passwordData.newPassword === passwordData.confirmPassword
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {passwordData.newPassword === passwordData.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    passwordStrength < 3 ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}