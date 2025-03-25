"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-2xl h-3/4 bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome</h1>
        <Link href="/auth">
          <Button className="w-48 h-12 text-lg">Login</Button>
        </Link>
        <Link href="/dashboard/home">
          <Button className="w-48 h-12 text-lg">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}