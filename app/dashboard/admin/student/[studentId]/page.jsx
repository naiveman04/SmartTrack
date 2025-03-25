"use client";

import { useTemporaryData } from "@/app/_globalContext/temporaryData";
import { useState } from "react";
import { InputCard } from "@/app/_components/FormInputField";
import {
  deleteStudentAPI,
  updateStudentAPI,
} from "@/app/_services/admin.students";
import { useRouter } from "next/navigation";

const EditPage = () => {
  const {
    selectedStudent,
    setSelectedStudent,
    selectedDivision,
    setSelectedDivision,
  } = useTemporaryData();
  const [action, setAction] = useState("Update");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  async function submitForm(e) {
    e.preventDefault();
    setSubmitted(true);
  
    const isUpdate = action === "Update";
    setMessage(isUpdate ? "Please wait, updating student..." : "Please wait, deleting student...");
  
    try {
      const result = isUpdate
        ? await updateStudentAPI(selectedStudent, selectedDivision)
        : await deleteStudentAPI(selectedStudent.id, selectedDivision);
  
      setMessage(result?.message || "Operation failed, please try again.");
    } catch (error) {
      setMessage("An error occurred, please try again.");
    }
  
    setTimeout(() => {
      setMessage("");
      router.push("/dashboard/admin/student");
      setSubmitted(false);
    }, 2000);
  }
  

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-lg w-full">
        {/* Title */}
        <div className="flex items-center mb-6 gap-3 w-full">
          {["Update", "Delete"].map((mode) => (
            <button
              key={mode}
              onClick={() => setAction(mode)}
              className={`px-4 py-2 font-semibold rounded-lg transition duration-200 flex-1 ${
                action === mode
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={submitted}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Text Message */}
        {message && (
          <p className="text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={submitForm}>
          {action === "Update" ? (
            <UpdateStudent
              setSelectedStudent={setSelectedStudent}
              selectedStudent={selectedStudent}
            ></UpdateStudent>
          ) : (
            <DeleteStudent selectedStudent={selectedStudent}></DeleteStudent>
          )}

          <button
            type="submit"
            className={`w-full px-4 py-3 font-semibold rounded-lg transition duration-200 ${
              submitted
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            disabled={submitted}
          >
            {submitted ? "Submitting..." : action}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;

// Update Student Form Structure
export function UpdateStudent({ selectedStudent, setSelectedStudent }) {
  const { id, rollNo, name } = selectedStudent;

  function handleChange(e) {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Update Student
      </h1>

      {/* RFID Number */}
      <InputCard
        labelText={"RFID Number"}
        inputName={"id"}
        inputValue={id}
        inputReadOnly={true}
      ></InputCard>

      {/* Roll No */}
      <InputCard
        labelText={"Student RollNo"}
        inputName={"rollNo"}
        inputValue={rollNo}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>

      {/* Name */}
      <InputCard
        labelText={"Student Name"}
        inputName={"name"}
        inputValue={name}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>
    </>
  );
}

// Delete Student Form Structure
export function DeleteStudent({ selectedStudent }) {
  const { id, rollNo, name } = selectedStudent;
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Update Student
      </h1>

      {/* RFID Number */}
      <InputCard
        labelText={"RFID Number"}
        inputName={"id"}
        inputValue={id}
        inputReadOnly={true}
      ></InputCard>

      {/* Name */}
      <InputCard
        labelText={"Student Name"}
        inputName={"name"}
        inputValue={name}
        inputReadOnly={true}
      ></InputCard>

      {/* Roll No */}
      <InputCard
        labelText={"Student RollNo"}
        inputName={"rollNo"}
        inputValue={rollNo}
        inputReadOnly={true}
      ></InputCard>
    </>
  );
}
