"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from './theme-btn';
import Link from 'next/link';
import { toast } from 'sonner';

const Navbar = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const authToken = JSON.parse(localStorage.getItem('authToken'));
  // console.log("From Navbar: ", authToken?.token?.user?.role);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken'); // Clear the auth token
      window.location.href = '/login'; // Redirect to login page
      toast("Logged out successfully", { variant: "success" });
    } catch (error) {
      console.error("Failed to logout", error);
      toast("Failed to logout", { variant: "error" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b dark:border-gray-800 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Text Logo */}
        <div className="text-2xl font-bold tracking-wide uppercase">
          <Link href={"/"}><span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Function Foundry</span></Link>
        </div>
        
        {/* Menu Icon */}
        <div className="md:hidden cursor-pointer text-white" onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          <li><Link href={"/"} className="hover:underline text-white">Home</Link></li>
          <li><Link href={"/about"} className="hover:underline text-white">About</Link></li>
          <li><Link href={"/services"} className="hover:underline text-white">Services</Link></li>
          <li><Link href={"/contact"} className="hover:underline text-white">Contact</Link></li>
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
          {isLoggedIn ? (
            <>
              <Link href={"/joblist"}><Button variant="outline" className={"cursor-pointer"}>Want a Job</Button></Link>
              {authToken?.token?.user?.role === "employer" && (
                  <Link href={"/employerdashboard"}><Button variant="outline" className={"cursor-pointer"}>Employer Dashboard</Button></Link>
              )}
              {authToken?.token?.user?.role === "candidate" && (
                  <Link href={"/candidatedashboard"}><Button variant="outline" className={"cursor-pointer"}>Candidate Dashboard</Button></Link>
              )}

              <Button variant="destructive" onClick={handleLogout} className={"cursor-pointer"}>Logout</Button>
              <ModeToggle />
            </>
          ) : (
            <>
              <Link href={"/login"}><Button variant="outline" className={"cursor-pointer"}>Login</Button></Link>
              <Link href={"/signup"}><Button className={"cursor-pointer"}>Sign Up</Button></Link>
              <ModeToggle />
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[50%] transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex flex-col items-center space-y-4 bg-slate-800/80 backdrop-blur-3xl">
          <Link href="/" className="hover:underline text-white" onClick={toggleMenu}>Home</Link>
          <Link href="/about" className="hover:underline text-white" onClick={toggleMenu}>About</Link>
          <Link href="/services" className="hover:underline text-white" onClick={toggleMenu}>Services</Link>
          <Link href="/contact" className="hover:underline text-white" onClick={toggleMenu}>Contact</Link>
          
          {/* Auth Buttons in Mobile Menu */}
          <div className="flex flex-col gap-2 w-full items-center">
            {isLoggedIn ? (
              <>
                <Link href={"/joblist"}><Button variant="outline">Want a Job</Button></Link>
                {authToken?.token?.user?.role === "employer" && (
                  <Link href={"/employerdashboard"}><Button variant="outline" className={"cursor-pointer"}>Employer Dashboard</Button></Link>
              )}
              {authToken?.token?.user?.role === "candidate" && (
                  <Link href={"/candidatedashboard"}><Button variant="outline" className={"cursor-pointer"}>Candidate Dashboard</Button></Link>
              )}
                <Button variant="destructive" onClick={handleLogout} className="w-full">Logout</Button>
                <ModeToggle />
              </>
            ) : (
              <>
                <Link href={"/login"}><Button variant="outline" className={"cursor-pointer"}>Login</Button></Link>
                <Link href={"/signup"}><Button className={"cursor-pointer"}>Sign Up</Button></Link>
                <ModeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;