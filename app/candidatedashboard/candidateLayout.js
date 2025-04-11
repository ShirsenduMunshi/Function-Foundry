"use client"
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar"; // Corrected path
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function CandidateDashboardLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authUser = localStorage.getItem('authToken');
    if (authUser) {
      const user = JSON.parse(authUser);
      if (user?.token?.user?.email) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
