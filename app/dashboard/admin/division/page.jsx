"use client";

import Table from "@/app/_components/Table";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { fetchDivisionGeneralDataAPI } from "@/app/_services/admin.division";
import Spinner from "@/app/_components/Spinner";

function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [divisionData, setDivisionData] = useState([]);

  const tableHead = useMemo(
    () => [
      { id: 1, theadName: "Division", colName: "id" },
      { id: 2, theadName: "Subjects", colName: "subjects" },
    ],
    []
  );

  const fetchDivisionData = useCallback(async () => {
    setLoading(true);
    const response = await fetchDivisionGeneralDataAPI();
    if (response.success) {
      setDivisionData(response.data);
    } else {
      setError(response.message || "Failed to fetch division data");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDivisionData();
  }, [fetchDivisionData]);


  const AddDivisionButton = useMemo(
    () => (
      <Link
        href="/dashboard/admin/division/add-division"
        passHref
        legacyBehavior
      >
        <Button
          aria-label="Add new division"
          className="flex items-center gap-2 py-2 px-6 bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 ml-auto"
        >
          <span className="hidden sm:inline">+ Add New Division</span>
          <UserPlus className="sm:hidden" size={20} />
        </Button>
      </Link>
    ),
    []
  );

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      {/* Header Section */}
      <div className="flex justify-end w-full">{AddDivisionButton}</div>

      {/* Content Section */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <Spinner></Spinner>
        ) : error ? (
          <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        ) : divisionData.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No divisions found
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2">
            <Table
              tableData={divisionData}
              tableHead={tableHead}
              showDivisionEdit={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Page);
