"use client";

import React, { useState, useEffect } from "react";
import { InputCard } from "@/app/_components/FormInputField";
import { addNewStudentAPI } from "@/app/_services/admin.students";
import { divsionArray } from "@/app/_globalContext/availablDivisions";

const AddStudentPage = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    rollNo: "",
    rfidNumber: "",
    division: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  // Form Submission
  async function submitForm(e) {
    e.preventDefault();
    setSubmitted(true);
    const result = await addNewStudentAPI(studentData);

    if (result.success) {
      setMessage(result.message);
      setStudentData({ name: "", rollNo: "", rfidNumber: "", division: "" });
    } else {
      setMessage(result?.message || "Operation failed, please try again.");
    }
    setTimeout(() => setMessage(""), 2000);
    setSubmitted(false);
  }

  // Main Function Return
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-lg w-full">
        {/* Text Message */}
        {message && (
          <p className="text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={submitForm}>
          <AddNewStudent
            division={divsionArray}
            studentData={studentData}
            setStudentData={setStudentData}
          ></AddNewStudent>

          <button
            type="submit"
            className={`w-full px-4 py-3 font-semibold rounded-lg transition duration-200 ${
              submitted
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            disabled={submitted}
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;

// Form Component
function AddNewStudent({ division, studentData, setStudentData }) {
  // Local Changes Set Student Data
  function handleChange(e) {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  }

  const { name, rollNo, rfidNumber } = studentData;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Register New Student
      </h1>

      {/* RFID Number (Read-only) */}
      <InputCard
        labelText={"RFID Number"}
        inputName={"rfidNumber"}
        inputValue={rfidNumber || ""}
        inputPlaceholder={"Scan RFID Card"}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>

      {/* Student Name */}
      <InputCard
        labelText={"Student Name"}
        inputName={"name"}
        inputValue={name || ""}
        inputPlaceholder={"Enter Student Name"}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>

      {/* Roll No */}
      <InputCard
        labelText={"Student Roll No"}
        inputName={"rollNo"}
        inputValue={rollNo || ""}
        inputPlaceholder={"Enter Student Name"}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>

      {/* Student Division */}
      {/* Student Division */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Student Division
        </label>
        <select
          name="division"
          value={studentData.division}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="" disabled>
            Select division
          </option>
          {division.map((item, id) => (
            <option value={item} key={id}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
