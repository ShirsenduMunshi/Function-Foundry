import Link from "next/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Card } from "@/components/ui/card";

export default function Footer() {
  return (
    <footer className="min-h-[30svh] flex flex-col justify-between items-center py-6">
      <Card className="w-full max-w-5xl mx-auto p-6 flex flex-col items-center text-center">
        <div className="flex justify-between items-center w-full space-x-4 text-xl">
          <div className="text-2xl font-bold tracking-wide uppercase">
              <Link href={"/"}><span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Function Foundry</span></Link>
          </div>
          <div className=" flex space-x-4 text-xl">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </Link>
            <Link href="https://www.linkedin.com/in/shirsendu-munshi-341590288" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </Link>
            <Link href="https://github.com/shirsendumunshi" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </Link>
          </div>
        </div>
        
        <div className="mt-4 space-x-6 text-sm">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-use">Terms of Use</Link>
        </div>
        
        <p className="mt-4 text-sm">© {new Date().getFullYear()} Function Foundry. All rights reserved.</p>
      </Card>
    </footer>
  );
}
