"use client";

import React, { useState } from "react";
import { InputCard } from "@/app/_components/FormInputField";
import { addNewTeacherAPI } from "@/app/_services/admin.teachers";
import { useRouter } from "next/navigation";

const AddTeacherPage = () => {
  const [teacherData, setTeacherData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Form Submission
  async function submitForm(e) {
    e.preventDefault();
    setSubmitted(true);
    try {
      const result = await addNewTeacherAPI(teacherData);

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(result?.message || "Operation failed, please try again.");
      }
    } catch (error) {
      setMessage(error.message || "An unexpected error occurred.");
    } finally {
      setSubmitted(false);
    }
  }

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
          <AddNewTeacher
            teacherData={teacherData}
            setTeacherData={setTeacherData}
          ></AddNewTeacher>

          <button
            type="submit"
            className={`w-full px-4 py-3 font-semibold rounded-lg transition duration-200 ${
              submitted
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            disabled={submitted}
          >
            Add Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherPage;

function AddNewTeacher({ teacherData, setTeacherData }) {
  // Local Changes Set Student Data
  function handleChange(e) {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  }

  const { name, email } = teacherData;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Register New Teacher
      </h1>

      {/* Student Name */}
      <InputCard
        labelText={"Teacher Name"}
        inputName={"name"}
        inputValue={name || ""}
        inputPlaceholder={"Enter Teacher Name"}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>

      {/* Roll No */}
      <InputCard
        labelText={"Teacher Email"}
        inputName={"email"}
        inputValue={email || ""}
        inputPlaceholder={"Enter Teacher Email"}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>
    </>
  );
}
