"use client";

import React, { useState } from "react";
import { LockIcon, UserIcon } from "@/public/loginForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TeacherAuth } from "../_services/teacherAuth";

function Page() {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [displayMessage, setDisplayMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleCredentialsChange(e) {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleFormSubmition(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await TeacherAuth(loginFormData);
      
      if (result.success) {
        setDisplayMessage(result.message);
        setTimeout(() => router.push('/dashboard/home'), 2000)
      } else {
        setDisplayMessage(result.message);
      }
      setTimeout(() => setDisplayMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6 px-4">
      <div className="max-w-md w-full">
        <div className="py-8 px-6 rounded-xl bg-white shadow-lg">
          <h2 className="text-neutral-800 text-center text-3xl font-bold">
            Sign In
          </h2>
          {displayMessage && (
            <p className="text-red-500 text-center mt-2">{displayMessage}</p>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleFormSubmition}>
            {/* Teacher Email */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Teacher Email
              </label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  value={loginFormData.email || ""}
                  type="email"
                  required
                  className="w-full text-gray-800 text-sm border border-gray-300 px-10 py-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter email"
                  onChange={handleCredentialsChange}
                />
                <UserIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-gray-500" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  value={loginFormData.password || ""}
                  required
                  onChange={handleCredentialsChange}
                  className="w-full text-gray-800 text-sm border border-gray-300 px-10 py-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter password"
                />
                <LockIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-gray-500" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="!mt-8">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-lg font-medium tracking-wide rounded-lg 
                           text-white bg-gradient-to-r from-purple-600 to-purple-800 
                           hover:from-purple-700 hover:to-purple-900 
                           active:scale-95 transition-all duration-200 ease-in-out 
                           disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Validate"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
