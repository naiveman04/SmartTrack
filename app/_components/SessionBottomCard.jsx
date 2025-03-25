"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {  toggleSessionAPI } from "../_services/session";
import { useRouter } from "next/navigation";

function SessionBottomCard({ sessionData, division }) {
  const {
    sessionActiveSubject,
    status,
    subjects,
    sessionTeacherName,
    sessionStartedAt,
  } = sessionData;

  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { data: session } = useSession();
  const router = useRouter();

  async function createSession() {
    if (!selectedSubject) {
      setMessage("Please select a subject before starting.");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    try {
      setLoading(true);
      const response = await toggleSessionAPI(
        session?.user?.id,
        division,
        "open",
        selectedSubject
      );

      setMessage(response.message);

      setTimeout(() => {
        setMessage(null);
        if (response.success) {
          router.push(`/dashboard/session/${division}/live`);
        }
      }, 3000);
    } finally {
      setLoading(false);
      setMessage(null);
    }
  }

  return (
    <div className="flex w-full flex-col items-center space-y-4 bg-gradient-to-br from-white to-purple-100 p-8 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      <Image
        src="/attendanceBegin.png"
        height={220}
        width={220}
        alt="Attendance Logo"
      />

      {status ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Current Session Details
          </h1>
          <SessionDetail
            label="Subject"
            value={sessionActiveSubject || "N/A"}
          />
          <SessionDetail
            label="Session Started At"
            value={
              sessionStartedAt
                ? new Date(sessionStartedAt).toLocaleString()
                : "N/A"
            }
          />
          <SessionDetail
            label="Session Created By"
            value={sessionTeacherName || "N/A"}
          />

          {/* View Session Button */}
          <Link href={`/dashboard/session/${division}/live`} className="mt-4">
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium px-12 py-2.5 rounded-md transition-transform transform hover:scale-105 shadow-md">
              View Session
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Welcome to Your Attendance Session!
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Select a subject and start your session with ease. Ensure accurate
            attendance tracking and streamline your classroom experience
            effortlessly.
          </p>

          {/* Subject Dropdown */}
          <div className="w-full max-w-md mt-4">
            <div className="relative">
              <select
                className="w-full mt-2 p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer shadow-sm hover:bg-gray-100 transition"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Select a subject
                </option>
                {subjects?.length ? (
                  subjects.map((subject, idx) => (
                    <option key={idx} value={subject}>
                      {subject}
                    </option>
                  ))
                ) : (
                  <option disabled>No subjects available</option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <p
              className={`text-sm font-medium mt-2 ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Start Session Button */}
          <Button
            onClick={createSession}
            disabled={loading} // Disable button when loading
            className="w-full sm:w-auto mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium px-12 py-2.5 rounded-md transition-transform transform hover:scale-105 shadow-md"
          >
            {loading ? "Starting..." : "Start Session"}
          </Button>
        </>
      )}
    </div>
  );
}

// Reusable component for session details
const SessionDetail = ({ label, value }) => (
  <p className="text-lg text-gray-700">
    {label}: <span className="text-purple-700 font-bold">{value || "N/A"}</span>
  </p>
);

export default SessionBottomCard;
