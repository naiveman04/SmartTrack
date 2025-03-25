"use client";

import { useTemporaryData } from "../_globalContext/temporaryData";
import Link from "next/link";
import { removeStudent } from "../_services/session";

function Table({
  tableData,
  tableHead,
  showStudentEdit,
  showDivisionEdit,
  showTeacherEdit,
  removeStudentButton,
  division,
}) {
  const {
    setSelectedStudent,
    setSelectedTeacher,
    setSelectedDivision,
  } = useTemporaryData();

  return (
    <div className="overflow-auto h-full">
      <table className="w-full table-auto border-collapse">
        {/* Table Head */}
        <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white sticky top-0 shadow-md">
          <tr>
            <th className="p-4 text-sm font-semibold text-center border-x border-b border-white">
              Sr. No.
            </th>
            {tableHead.map(({ id, theadName }) => (
              <th
                key={id}
                className="p-4 text-sm font-semibold text-center border-x border-b border-white"
              >
                {theadName}
              </th>
            ))}
            {(showStudentEdit || showDivisionEdit || showTeacherEdit || removeStudentButton) && (
              <th className="p-4 text-sm font-semibold text-center border-x border-b border-white">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 bg-gray-50">
          {tableData.map((item, index) => (
            <tr className="hover:bg-gray-50" key={item.id || index}>
              <td className="text-gray-800 text-center p-4 text-sm border-x border-b">
                {index + 1}
              </td>

              {tableHead.map(({ colName }, colIndex) => (
                <td
                  key={colIndex}
                  className="text-gray-800 text-center p-4 text-sm border-x border-b"
                >
                  {renderCellContent(item?.[colName])}
                </td>
              ))}

              {/* Actions Column */}
              {(showStudentEdit || showDivisionEdit || showTeacherEdit || removeStudentButton) && (
                <td className="text-gray-800 text-center p-4 text-sm border-x border-b">
                  {showStudentEdit && (
                    <ActionLink
                      href={`/dashboard/admin/student/${item.id}`}
                      text="Edit Student"
                      onClick={() => setSelectedStudent(item)}
                    />
                  )}
                  {showDivisionEdit && (
                    <ActionLink
                      href={`/dashboard/admin/division/${item.id}`}
                      text="Edit Division"
                      onClick={() => setSelectedDivision(item)}
                    />
                  )}
                  {showTeacherEdit && (
                    <ActionLink
                      href={`/dashboard/admin/teacher/${item.id}`}
                      text="Edit"
                      onClick={() => setSelectedTeacher(item)}
                    />
                  )}
                  {removeStudentButton && (
                    <span
                      onClick={() => removeStudent(division, item.id)}
                      className="text-red-500 hover:underline cursor-pointer ml-3"
                    >
                      Remove
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

/** Component for Action Links */
const ActionLink = ({ href, text, onClick }) => (
  <Link href={href} className="text-green-500 hover:underline mr-3" onClick={onClick}>
    {text}
  </Link>
);

/** Render Table Cell Content */
function renderCellContent(value) {
  if (Array.isArray(value)) {
    return (
      <div className="flex items-center gap-2 justify-center text-white">
        {value.map((item, id) => (
          <span key={id} className="bg-purple-500 rounded-lg py-1 px-3">
            {item}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <span className={`font-semibold ${value ? "text-green-600" : "text-red-600"}`}>
      {value ? "Active" : "Inactive"}
    </span>;
  }

  if (typeof value === "object" && value !== null) {
    return <pre className="text-sm text-gray-700">{JSON.stringify(value, null, 2)}</pre>;
  }

  return value ?? "-";
}
