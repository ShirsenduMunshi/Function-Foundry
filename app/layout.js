import { Geist, Geist_Mono } from "next/font/google";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
// import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Function Foundry - Where Talent Takes Shape",
  description: "Find your dream tech job at Function Foundry. We connect top developers with exciting opportunities at innovative companies.",
  author: "Shirsendu Munshi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ClientThemeProvider>
            <main>
              {children}
            </main>
            <Toaster />
            <Footer />
          </ClientThemeProvider>
        </body>
      </html>
  );
}
