'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; // Import Sonner for toasts

const SignupPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'candidate',
      bio: '',
      skills: [],
      resume: '',
      profilePicture: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      role: Yup.string().required('Role is required'),
      bio: Yup.string(),
      skills: Yup.array().of(Yup.string()),
      resume: Yup.string(),
      profilePicture: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);

      // Create FormData object
      const data = new FormData();
      data.append('name', values.name);
      data.append('email', values.email);
      data.append('password', values.password);
      data.append('role', values.role);
      data.append('bio', values.bio);
      data.append('skills', values.skills.join(', '));
      if (resumeFile) {
        data.append('resume', resumeFile); // Append the file directly
      }
      if (profilePictureFile) {
        data.append('profilePicture', profilePictureFile); // Append the file directly
      }

      try {
        // Submit form data to your API route
        const response = await axios.post('/api/auth/signup', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.message === 'User created successfully') {
          // Show success toast
          toast.success('Account created successfully!', {
            description: 'You will be redirected to the login page.',
          });

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          // Show error toast if the response is not as expected
          toast.error('Something went wrong!', {
            description: 'Please try again later.',
          });
        }
      } catch (error) {
        // Show error toast if the request fails
        toast.error('Failed to create account!', {
          description: error.response?.data?.message || 'Please check your inputs and try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Sign Up for Function Foundry</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup
              defaultValue="candidate"
              onValueChange={(value) => formik.setFieldValue('role', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="candidate" id="candidate" />
                <Label htmlFor="candidate">Candidate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer">Employer</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              name="skills"
              type="text"
              placeholder="JavaScript, React, Node.js"
              value={formik.values.skills.join(', ')}
              onChange={(e) =>
                formik.setFieldValue('skills', e.target.value.split(',').map((s) => s.trim()))
              }
              onBlur={formik.handleBlur}
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <Input
              id="profilePicture"
              name="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;