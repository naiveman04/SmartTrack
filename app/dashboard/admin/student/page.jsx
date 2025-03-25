"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { fetchStudentDataAPI } from "@/app/_services/admin.students";
import Table from "@/app/_components/Table";
import Spinner from "@/app/_components/Spinner";
import { divsionArray } from "@/app/_globalContext/availablDivisions";
import { useTemporaryData } from "@/app/_globalContext/temporaryData";

function Page() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedDivision, setSelectedDivision } = useTemporaryData();

  const tableHead = useMemo(
    () => [
      { id: 1, theadName: "Roll No", colName: "rollNo" },
      { id: 2, theadName: "Name", colName: "name" },
      { id: 3, theadName: "Rfid No", colName: "id" },
      { id: 4, theadName: "Total Attendance", colName: "attendance" },
    ],
    []
  );

  const fetchStudentData = useCallback(async (division, signal) => {
    setLoading(true);
    setError(null);

    const result = await fetchStudentDataAPI(division, { signal });
    if (result.success) {
      setStudentData(result.data);
    } else {
      setError(result.message || "Failed to fetch data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedDivision) {
      setStudentData(null);
      return;
    }

    const abortController = new AbortController();
    fetchStudentData(selectedDivision, abortController.signal);

    return () => abortController.abort();
  }, [selectedDivision, fetchStudentData]);

  return (
    <div className="flex flex-col w-full h-full shadow-sm ">
      <div className="flex justify-between items-center w-full mb-4 px-2 gap-4">
        <DivisionDropdown
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          loading={loading}
        />
        <AddStudentButton />
      </div>

      <div className="w-full h-full">
        {loading ? (
          <Spinner></Spinner>
        ) : error ? (
          <p className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
            {error}
          </p>
        ) : !selectedDivision ? (
          <p className="text-center text-gray-500 p-4">Select a Division</p>
        ) : (
          <Table
            tableData={studentData?.students || []}
            tableHead={tableHead}
            showStudentEdit={true}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(Page);

const DivisionDropdown = ({
  selectedDivision,
  setSelectedDivision,
  loading,
}) => (
  <select
    aria-label="Select division"
    className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
    value={selectedDivision}
    onChange={(e) => setSelectedDivision(e.target.value)}
    disabled={loading}
  >
    <option value="">Select Division</option>
    {divsionArray.map((div) => (
      <option key={div} value={div}>
        {div}
      </option>
    ))}
  </select>
);

const AddStudentButton = React.memo(() => (
  <Link href="/dashboard/admin/student/add-student">
    <Button className="flex items-center gap-5 py-2 px-6 bg-purple-600 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-purple-700">
      <span className="hidden sm:inline">+ Add New Student</span>
      <UserPlus className="sm:hidden" size={20} />
    </Button>
  </Link>
));
