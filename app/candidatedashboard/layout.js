// app/clientdashboard/layout.js
import { Inter } from "next/font/google";
import "../globals.css";
import CandidateDashboardLayout from "./candidateLayout"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Function Foundry - Candidate Dashboard",
  description: "Boost your carrier with Function Foundry"
};

export default function DashboardLayout({ children }) {

  return (
    <>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <CandidateDashboardLayout>
            {children}
            <Toaster />
          </CandidateDashboardLayout>
        </main>
      </div>
    </>
  );
}
