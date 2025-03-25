"use client";

import Table from "@/app/_components/Table";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchTeachersAPI } from "@/app/_services/admin.teachers";
import Spinner from "@/app/_components/Spinner";

function Page() {
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized table headers
  const tableHead = useMemo(() => [
    { id: 1, theadName: "Name", colName: "name" },
    { id: 2, theadName: "Registered Email", colName: "email" },
    { id: 3, theadName: "Verified", colName: "isVerified" },
  ], []);

  // Memoized fetch function
  const fetchTeacherData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchTeachersAPI();
      if (result.success) {
        setTeacherData(result.data);
      } else {
        setError(result.message || "Failed to fetch teachers");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      {/* Header Section */}
      <div className="flex justify-end items-center w-full">
        <AddTeacherButton />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        ) : teacherData.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No teachers found</div>
        ) : (
          <div className="h-full overflow-y-auto pr-2">
            <Table
              tableData={teacherData}
              tableHead={tableHead}
              showTeacherEdit={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Memoized Add Teacher Button
function AddTeacherButton() {
  return (
    <Link href="/dashboard/admin/teacher/add-teacher" passHref>
      <Button
        aria-label="Add new teacher"
        className="flex items-center gap-2 py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
      >
        <span className="hidden sm:inline">+ Add New Teacher</span>
        <span className="sm:hidden">+ Add</span>
      </Button>
    </Link>
  );
}

export default React.memo(Page);
