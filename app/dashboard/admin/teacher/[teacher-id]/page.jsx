"use client";

import { useTemporaryData } from "@/app/_globalContext/temporaryData";
import { useState } from "react";
import { InputCard } from "@/app/_components/FormInputField";
import { useRouter } from "next/navigation";
import { updateTeacherAPI, deleteTeacherAPI } from "@/app/_services/admin.teachers";

const EditPage = () => {
  const { selectedTeacher, setSelectedTeacher } = useTemporaryData();
  const [action, setAction] = useState("Update");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  async function submitForm(e) {
    e.preventDefault();
    setSubmitted(true);

    setMessage(
      action === "Update"
        ? "Please wait, updating Teacher..."
        : "Please wait, deleting Teacher..."
    );

    let result = null;
    try {
      if (action === "Update") {
        result = await updateTeacherAPI(selectedTeacher);
      } else {
        result = await deleteTeacherAPI(selectedTeacher);
      }
  
      if (result?.success) {
        setMessage(result.message);
        
        setTimeout(() => {
          setMessage("");
          router.push('/dashboard/admin/teacher'); 
        }, 2000);
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
            <UpdateTeacher
              setSelectedTeacher={setSelectedTeacher}
              selectedTeacher={selectedTeacher}
            ></UpdateTeacher>
          ) : (
            <DeleteTeacher selectedTeacher={selectedTeacher}></DeleteTeacher>
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
export function UpdateTeacher({ selectedTeacher, setSelectedTeacher }) {
  const { name, email } = selectedTeacher;

  function handleChange(e) {
    const { name, value } = e.target;
    setSelectedTeacher((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Update
      </h1>

      {/* RFID Number */}
      <InputCard
        labelText={"Teacher Name"}
        inputName={"name"}
        inputValue={name}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>

      {/* Roll No */}
      <InputCard
        labelText={"Teacher Email"}
        inputName={"email"}
        inputValue={email}
        inputReadOnly={false}
        onChange={handleChange}
      ></InputCard>
    </>
  );
}

// Delete Student Form Structure
export function DeleteTeacher({ selectedTeacher }) {
  const { name, email, id } = selectedTeacher;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Delete
      </h1>

      {/* Name */}
      <InputCard
        labelText={"Teacher Name"}
        inputName={"name"}
        inputValue={name}
        inputReadOnly={true}
      ></InputCard>

      {/* Roll No */}
      <InputCard
        labelText={"Teacher Email"}
        inputName={"email"}
        inputValue={email}
        inputReadOnly={true}
      ></InputCard>
    </>
  );
}
