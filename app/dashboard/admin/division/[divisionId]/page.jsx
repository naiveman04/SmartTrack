"use client";

import { useTemporaryData } from "@/app/_globalContext/temporaryData";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addNewSubjectAPI } from "@/app/_services/admin.division";

const EditPage = () => {
  const { selectedDivision, setSelectedDivision } = useTemporaryData();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const [newSubject, setNewSubject] = useState("");

  async function submitForm(e) {
    e.preventDefault();
    setSubmitted(true);

    setMessage("Updating Division...");
    const result = await addNewSubjectAPI(newSubject, selectedDivision?.id);
    setMessage(result?.message || "Updated Sucessfully completed.");
    setSubmitted(false);

    setTimeout(() => {
      setMessage("");
      router.push("/dashboard/admin/division");
    }, 2000);
  }

  return (
    <div className="flex justify-center items-center min-h-full px-4">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full">
        {/* Status Message */}
        {message && (
          <p className="text-center text-sm font-medium text-purple-600 animate-pulse">
            {message}
          </p>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={submitForm}>
          <UpdateDivision
            setNewSubject={setNewSubject}
            selectedDivision={selectedDivision}
            newSubject={newSubject}
          />

          <button
            type="submit"
            className={`w-full px-5 py-3 text-lg font-semibold rounded-md transition-all duration-300
              ${
                submitted
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-purple-700 text-white hover:bg-purple-800 shadow-md"
              }`}
            disabled={submitted}
          >
            {submitted ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;

function UpdateDivision({ selectedDivision, setNewSubject, newSubject }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
        Update Division
      </h2>

      {/* Division Name */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Division</label>
        <input
          type="text"
          value={selectedDivision?.id || ""}
          disabled
          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
        />
      </div>

      {/* Subjects List */}
      {selectedDivision?.subjects?.length > 0 && (
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Subjects</label>
          <div className="flex flex-wrap gap-2">
            {selectedDivision.subjects.map((sub, idx) => (
              <span
                key={idx}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Subject */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add a new subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
    </>
  );
}
