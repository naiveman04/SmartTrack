"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-purple-600">
   
      
      {/* Content Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-purple-800 mb-2">Welcome</h1>
        <p className="text-gray-600 text-center mb-6">Access your college portal and resources</p>
        
        <div className="w-full space-y-4">
          <Link href="/auth" className="block w-full">
            <Button className="w-full py-6 bg-purple-700 hover:bg-purple-800 text-lg font-medium">
              Login
            </Button>
          </Link>
          
          <Link href="/dashboard/home" className="block w-full">
            <Button variant="outline" className="w-full py-6 border-purple-400 text-purple-700 hover:bg-purple-100 text-lg font-medium">
              Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          © 2025 College Portal PICT
        </div>
      </div>
    </div>
  );
}