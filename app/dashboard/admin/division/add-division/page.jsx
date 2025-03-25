"use client";

import React, { useState } from "react";
import { InputCard } from "@/app/_components/FormInputField";
import { addNewDivisionAPI } from "@/app/_services/admin.division";

const AddDivisionPage = () => {
  const [divisionData, setDivisionData] = useState({
    division: "",
    subjects: [],
  });

  const [subjectInput, setSubjectInput] = useState(""); // Temporary input for subjects
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  // Add new subject to the array
  const addSubject = () => {
    if (
      subjectInput.trim() !== "" &&
      !divisionData.subjects.includes(subjectInput)
    ) {
      setDivisionData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()],
      }));
      setSubjectInput(""); 
    }
  };

  // Remove subject from the list
  const removeSubject = (subject) => {
    setDivisionData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((sub) => sub !== subject),
    }));
  };

  // Handle form submission
  async function submitForm(e) {
    e.preventDefault();
    setSubmitted(true);
    setMessage("Please wait, adding New Division...");    
    const result = await addNewDivisionAPI(divisionData);
    
    setMessage(result?.message);
    setSubmitted(false);

    // Clear form after 2 seconds
    setTimeout(() => {
      setMessage("");
      setDivisionData({ division: "", subjects: [] });
    }, 2000);
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-lg w-full">
        {/* Message Display */}
        {message && (
          <p className="text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={submitForm}>
          <h1 className="text-2xl font-bold text-center text-purple-700">
            Add New Division
          </h1>

          {/* Division Name */}
          <InputCard
            labelText={"Division Name"}
            inputName={"division"}
            inputValue={divisionData.division}
            inputPlaceholder={"Enter Division Name"}
            inputReadOnly={false}
            onChange={(e) =>
              setDivisionData((prev) => ({
                ...prev,
                division: e.target.value,
              }))
            }
          />

          {/* Subject Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Add Subject
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="Enter subject"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                type="button"
                onClick={addSubject}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Add 
              </button>
            </div>
          </div>

          {/* Display Added Subjects */}
          {divisionData.subjects.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Subjects List
              </label>
              <div className="flex flex-wrap gap-2">
                {divisionData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center space-x-2"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-3 font-semibold rounded-lg transition duration-200 ${
              submitted
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            disabled={submitted}
          >
            Add Division
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDivisionPage;
