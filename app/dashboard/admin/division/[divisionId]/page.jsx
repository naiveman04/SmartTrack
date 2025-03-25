"use client";

import { useTemporaryData } from "@/app/_globalContext/temporaryData";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EditPage = () => {
  const { selectedDivision, setSelectedDivision } = useTemporaryData();
  const [action, setAction] = useState("Update");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  async function submitForm(e) {
    e.preventDefault();
    setSubmitted(true);

    setMessage(action === "Update" ? "Updating Division..." : "Deleting Division...");

    let result = null;
    if (action === "Update") {
      // result = await updateDivisionAPI(selectedDivision);
    } else {
      // result = await deleteDivisionAPI(selectedDivision);
    }

    setMessage(result?.message || "Operation completed.");
    setSubmitted(false);

    setTimeout(() => {
      setMessage("");
      router.push("/dashboard/admin/student");
    }, 2000);
  }

  return (
    <div className="flex justify-center items-center min-h-full px-4">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full">
        {/* Action Selection */}
        <div className="flex items-center mb-6 gap-4">
          {["Update", "Delete"].map((mode) => (
            <button
              key={mode}
              onClick={() => setAction(mode)}
              className={`px-5 py-3 text-lg font-semibold rounded-md transition-all duration-300 flex-1
                ${action === mode ? "bg-purple-700 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              disabled={submitted}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Status Message */}
        {message && (
          <p className="text-center text-sm font-medium text-purple-600 animate-pulse">{message}</p>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={submitForm}>
          {action === "Update" ? (
            <UpdateDivision
              setSelectedDivision={setSelectedDivision}
              selectedDivision={selectedDivision}
            />
          ) : (
            <DeleteDivision selectedDivision={selectedDivision} />
          )}

          <button
            type="submit"
            className={`w-full px-5 py-3 text-lg font-semibold rounded-md transition-all duration-300
              ${submitted ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-purple-700 text-white hover:bg-purple-800 shadow-md"}`}
            disabled={submitted}
          >
            {submitted ? "Processing..." : action}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;

function UpdateDivision({ selectedDivision, setSelectedDivision }) {
  const [newSubject, setNewSubject] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setSelectedDivision((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  function removeSubject(subject) {
    setSelectedDivision((prev) =>
      prev
        ? {
            ...prev,
            subjects: prev.subjects.filter((s) => s !== subject),
          }
        : prev
    );
  }

  function addSubject() {
    if (newSubject.trim() && selectedDivision?.subjects && !selectedDivision.subjects.includes(newSubject)) {
      setSelectedDivision((prev) =>
        prev
          ? {
              ...prev,
              subjects: [...prev.subjects, newSubject],
            }
          : prev
      );
      setNewSubject("");
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-purple-700">Update Division</h2>

      {/* Division Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Division</label>
        <input
          type="text"
          value={selectedDivision?.id || ""}
          disabled
          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
        />
      </div>

      {/* Subjects Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Subjects</label>
        <select
          className="w-full px-4 py-2 border rounded-md bg-white text-gray-700"
          onChange={(e) => removeSubject(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select subject to remove
          </option>
          {selectedDivision?.subjects?.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Add Subject */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add a new subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <button
          type="button"
          onClick={addSubject}
          className="px-4 py-2 bg-purple-700 text-white rounded-md shadow-md hover:bg-purple-800 transition"
        >
          Add
        </button>
      </div>
    </>
  );
}

function DeleteDivision({ selectedDivision }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-red-600">Delete Division</h2>

      {/* Division Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Division</label>
        <input
          type="text"
          value={selectedDivision?.id || ""}
          disabled
          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
        />
      </div>

      {/* Subjects Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Subjects in this Division</label>
        <select className="w-full px-4 py-2 border rounded-md bg-white text-gray-700" disabled>
          {selectedDivision?.subjects?.map((subject, index) => (
            <option key={index}>{subject}</option>
          ))}
        </select>
      </div>

      <p className="text-center text-gray-700 font-medium">
        This action is irreversible. The division and all its data will be permanently deleted.
      </p>
    </>
  );
}
