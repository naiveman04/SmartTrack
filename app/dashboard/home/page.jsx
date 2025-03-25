"use client";

import HomeUserCard from "@/app/_components/HomeUserCard";
import RadarGraph from "@/app/_components/RadarGraph";
import Spinner from "@/app/_components/Spinner";
import { useSessionContext } from "@/app/_globalContext/sessionContext";
import React, { useEffect, useState } from "react";

function StatsSection() {
  const { sessionData } = useSessionContext();
  const [loading, setLoading] = useState(true);
  const [divisionData, setDivisionData] = useState([]);
  const [overAllAttendance, setOverAllAttendance] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    if (sessionData.length > 0) {
      // Map data for divisions
      const data = sessionData.map((item) => ({
        division: item.id,
        averageAttendance: item.averageAttendance || 0,
      }));

      setDivisionData(data);
      console.log(sessionData);

      // Calculate total students
      const totalStudentsCount = sessionData.reduce(
        (sum, item) => sum + (item.totalStudents || 0),
        0
      );

      // Calculate total sessions
      const totalSessionsCount = sessionData.reduce(
        (sum, item) => sum + (item.totalSessions || 0),
        0
      );

      // Calculate overall average attendance (weighted mean)
      let totalAttendance = 0;
      let totalWeight = 0;

      sessionData.forEach((item) => {
        const weight = item.totalStudents || 1; // Avoid division by zero
        totalAttendance += (item.averageAttendance || 0) * weight;
        totalWeight += weight;
      });

      const weightedAverageAttendance =
        totalWeight > 0 ? totalAttendance / totalWeight : 0;

      setTotalStudents(totalStudentsCount);
      setTotalSessions(totalSessionsCount);
      setOverAllAttendance(weightedAverageAttendance);
      setLoading(false);
    }
  }, [sessionData]);

  return (
    <div className="p-2">
      {divisionData && !loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <HomeUserCard />
            <RadarGraph divisionData={divisionData} />
          </div>

          {/* Session Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {[
              { title: "Total Students", count: totalStudents },
              { title: "Total Sessions", count: totalSessions },
              {
                title: "Overall Average Attendance",
                count: `${(overAllAttendance * 100).toFixed(2)}%`,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl shadow-md hover:shadow-lg bg-gradient-to-br from-[#D8B4FE] to-[#A78BFA] 
            text-center text-white transform transition-all duration-300 hover:scale-105"
              >
                <div className="text-lg font-medium opacity-90">
                  {item.title}
                </div>
                <div className="text-4xl font-bold mt-2">{item.count}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default StatsSection;
