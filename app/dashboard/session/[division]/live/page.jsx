"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Table from "@/app/_components/Table";
import { useParams, useRouter } from "next/navigation"; 
import {
  fetchLiveAttendanceAPI,
  toggleSessionAPI,
} from "@/app/_services/session";
import { useSession } from "next-auth/react";
import { useTemporaryData } from "@/app/_globalContext/temporaryData";

function Page() {
  const { division } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);const {
      setSelectedStudent,
      setSelectedTeacher,
      setSelectedDivision,
      setLiveStudent,
      liveStudent
    } = useTemporaryData();

  async function closeSession() {
    try {
      setLoading(true);
      const response = await toggleSessionAPI(
        session?.user?.id,
        division,
        "close"
      );

      setMessage(response.message);

      setTimeout(() => {
        setMessage(null);
        if (response.success) {
          router.push(`/dashboard/session/${division}`);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  console.log(liveStudent);
  

  useEffect(() => {
    const unsubscribe = fetchLiveAttendanceAPI(division, (data) => {
      // Convert object to array and ensure each item has a unique key
      const formattedData = Object.entries(data || {}).map(([key, value]) => ({
        id: key, // Use Firebase's key as an identifier
        ...value,
      }));
  
      setAttendanceData(formattedData);
    });
  }, [division]);

  console.log(attendanceData);
  

  const tableHead = [
    { id: 1, theadName: "Student RollNo", colName: "rollNo" },
    { id: 2, theadName: "Student Name", colName: "name" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-2">
      {message && (
        <p className="text-lg font-semibold text-purple-800 text-center">
          {message}
        </p>
      )}

      {attendanceData.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-center p-8 rounded-lg">
          <p className="text-2xl font-bold text-purple-800">
            No attendance records found.
          </p>
          <p className="text-md text-purple-600">
            Please ensure students have scanned their attendance.
          </p>
        </div>
      ) : (
        <>
          {/* Responsive Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative bg-gradient-to-r from-purple-500 to-purple-800 text-white p-6 rounded-xl shadow-lg w-full flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Present Students</h3>
                <p className="font-bold text-3xl">{attendanceData.length}</p>
              </div>
              <span className="text-5xl opacity-90">🎓</span>
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-xl blur-xl"></div>
            </div>
          </div>

          {/* Table Container */}
          <div className="h-full shadow-md">
            <Table tableData={attendanceData} tableHead={tableHead} removeStudentButton={true} division={division}/>
          </div>
        </>
      )}

      {/* Buttons Section */}
      <div className=" flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={closeSession}
          disabled={false}
          className="w-full bg-green-600 max-w-lg hover:bg-green-700 text-white"
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
              Closing Session...
            </span>
          ) : (
            "Close Session"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Page;
