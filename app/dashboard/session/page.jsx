"use client";

import { useSessionContext } from "@/app/_globalContext/sessionContext";
import React, { useEffect, useState, useMemo } from "react";
import Spinner from "@/app/_components/Spinner";
import Link from "next/link";

function Page() {
  const { error, sessionData } = useSessionContext();
  const [loading, setLoading] = useState(true);

  // Simulate local loading state when sessionData is being fetched
  useEffect(() => {
    if (sessionData !== null) {
      setLoading(false);
    }
  }, [sessionData]);


  // Handle loading and error states early
  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!sessionData?.length) return <p>No Division Exists</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sessionData.map((card) => (
        <SessionCard key={card.id} item={card}></SessionCard>
      ))}
    </div>
  );
}

export default Page;

function SessionCard({ item }) {
  const {
    id,
    sessionActiveSubject,
    sessionStartedAt,
    status,
    sessionTeacherName,
    sessionEndedAt,
  } = item;

  return (
    <Link
      href={`/dashboard/session/${id}`}
      className="block transform transition-all duration-300"
    >
      <div className="relative p-6 bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 border border-gray-300 rounded-lg hover:shadow-xl transition-all hover:border-purple-500 transform hover:scale-102">
        {/* Division Tag (Top-Left) */}
        <div className="absolute top-2 left-2 bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
          {id}
        </div>

        {/* Status Indicator (Top-Right) */}
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${
              status ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {status ? "Active" : "No Session"}
          </span>
        </div>

        {/* Session Details */}
        <div className="mt-4 space-y-3 text-gray-800">
          <p className="font-semibold text-sm flex items-center">
            📚 <span className="ml-2 text-gray-700">Subject:</span>
            <span className="ml-2 text-purple-700 font-bold">
              {sessionActiveSubject || "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            👨‍🏫 <span className="font-semibold">Teacher:</span>
            <span className="ml-2 text-purple-600 font-bold">
              {sessionTeacherName || "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            🕒 <span className="font-semibold">Started At:</span>
            <span className="ml-2 text-purple-600 font-bold">
              {status
                ? sessionStartedAt
                  ? new Date(sessionStartedAt).toLocaleString()
                  : "N/A"
                : "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            ⏳ <span className="font-semibold">Ended At:</span>
            <span className="ml-2 text-purple-600 font-bold">
              {!status && sessionEndedAt
                ? new Date(sessionEndedAt).toLocaleString()
                : "N/A"}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
