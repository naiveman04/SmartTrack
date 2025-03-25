"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClassWelcomeCard from "@/app/_components/ClassWelcomeCard";
import Spinner from "@/app/_components/Spinner";
import { useSessionContext } from "@/app/_globalContext/sessionContext";
import SessionBottomCard from "@/app/_components/SessionBottomCard";

function Page() {
  const { division } = useParams();
  const { error, sessionData } = useSessionContext();
  const [divisionData, setDivisionData] = useState(null);

  useEffect(() => {
    if (!sessionData?.length) return;
    const divisionInfo = sessionData.find((sess) => sess.id === division);
    setDivisionData(divisionInfo || null);
  }, [division, sessionData]);

  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (!sessionData?.length || !divisionData) return <Spinner />;

  const { status, totalStudents } = divisionData;

  return (
    <div className="space-y-6 p-1">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <ClassWelcomeCard />

        {/* Right Section */}
        <div className="flex-grow rounded-lg border border-gray-200 p-6 bg-gradient-to-br from-purple-100 to-white relative shadow-md transition-shadow hover:shadow-xl">
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Status:{" "}
              <span
                className={`font-bold ${
                  status ? "text-green-600" : "text-red-600"
                }`}
              >
                {status ? "Active" : "No Current Session"}
              </span>
            </p>
            <h1 className="text-2xl font-bold text-purple-700">
              Division: {division.toUpperCase() || "N/A"}
            </h1>
            <p className="text-lg text-gray-700">
              Total Students:{" "}
              <span className="font-bold text-purple-700">{totalStudents}</span>
            </p>
          </div>

          {/* Attendance Button */}
          <div className="sm:absolute sm:top-4 sm:right-4 mt-4 sm:mt-0">
            <Link href={`/dashboard/session/${division}/attendance`}>
              <Button
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium
               px-5 py-2.5 rounded-md transition-transform transform hover:scale-105 shadow-md"
              >
                Attendance
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <SessionBottomCard
        sessionData={divisionData}
        division={division}
      ></SessionBottomCard>
    </div>
  );
}

export default Page;
