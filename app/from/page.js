"use client"
import axios from 'axios';
import { useState } from 'react';

export default function EmployerDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    employer: '',
    logo: null,
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append('title', formData.title);
  data.append('company', formData.company);
  data.append('description', formData.description);
  data.append('location', formData.location);
  data.append('salary', formData.salary);
  if (formData.logo) {
    data.append('logo', formData.logo);
  }

  try {
    const response = await axios.post('/api/jobs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Job posted successfully!');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 mt-20">Employer Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Salary"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Job Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Post Job
        </button>
      </form>
    </div>
  );
}