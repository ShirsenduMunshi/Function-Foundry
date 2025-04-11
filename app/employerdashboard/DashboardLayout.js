"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import Navbar from "@/components/Navbar";

const sidebarLinks = [
  { name: "Dashboard", href: "/employerdashboard" },
  { name: "Post Job", href: "/employerdashboard/postjob" },
  // { name: "View Applications", href: "/employerdashboard/viewapplications" },
  { name: "Settings", href: "/employerdashboard/settings" },
];

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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
      <div className="min-h-[10svh]">
        <Navbar isLoggedIn={isLoggedIn}/>
      </div>
      <div className="flex min-h-screen relative">
        {/* Sidebar (Hidden on mobile, visible on larger screens) */}
        <aside className="hidden md:flex flex-col w-64 p-6 border-r min-h-screen">
          <h2 className="text-2xl font-semibold mb-6">Employer Dashboard</h2>
          <Separator className="mb-4" />
          <nav>
            <ul className="space-y-3">
              {sidebarLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block p-2 rounded-md transition ${
                      pathname === link.href ? "font-semibold underline" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar (Drawer) */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden fixed top-[15%] left-4 z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 m-2 p-4">
            <h2 className="text-2xl font-semibold mb-4">Employer Dashboard</h2>
            <Separator className="mb-4" />
            <nav>
              <ul className="space-y-3">
                {sidebarLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block p-2 rounded-md transition ${
                        pathname === link.href ? "font-semibold underline" : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;