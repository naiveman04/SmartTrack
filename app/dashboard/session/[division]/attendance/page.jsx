"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Table from "@/app/_components/Table";
import { fetchAttendanceAPI } from "@/app/_services/session";
import Spinner from "@/app/_components/Spinner";

function Page() {
  const { division } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState(null);

  const staticTableHead = useMemo(() => [
    { id: 1, theadName: "Student RollNo", colName: "rollNo" },
    { id: 2, theadName: "Student Name", colName: "name" },
  ], []);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchAttendance(division) {
      setLoader(true);
      setMessage(null);
      try {
        const response = await fetchAttendanceAPI(division, { 
          signal: abortController.signal 
        });
        
        if (response.success) {
          const { students, subjects } = response.data.data;
          setStudents(students);
          setSubjects(subjects);
        } else {
          setMessage(response.message || "Failed to fetch division attendance");
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setMessage(error.message || "An error occurred while fetching data");
        }
      } finally {
        setLoader(false);
      }
    }

    if (division) fetchAttendance(division);

    return () => abortController.abort();
  }, [division]);

  const dynamicTableHead = useMemo(() => [
    ...staticTableHead,
    ...subjects.map((subject, index) => ({
      id: index + 3,
      theadName: subject,
      colName: subject,
    })),
  ], [subjects, staticTableHead]);

  const studentsWithAttendance = useMemo(() => (
    students.map(student => {
      const attendanceData = student.attendance || {};
      const updatedStudent = { ...student };
      
      subjects.forEach(subject => {
        updatedStudent[subject] = attendanceData[subject] || {};
      });

      return updatedStudent;
    })
  ), [students, subjects]);

  if (loader) return <Spinner></Spinner>;
  if (message) return <p>{message}</p>;
  if (!students.length || !subjects.length) return <p>No attendance data available</p>;

  return (
    <div>
      <Table 
        tableHead={dynamicTableHead} 
        tableData={studentsWithAttendance} 
      />
    </div>
  );
}

export default Page;