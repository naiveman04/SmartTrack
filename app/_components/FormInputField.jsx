"use client";

export function InputCard({
  labelText,
  inputName,
  inputValue,
  inputPlaceholder,
  inputReadOnly,
  onChange,
}) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-1">
        {labelText}
      </label>
      <input
        type="text"
        name={inputName}
        value={inputValue}
        placeholder={inputPlaceholder}
        readOnly={inputReadOnly}
        onChange={onChange}
        className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 outline-none ${
          inputReadOnly
            ? "bg-gray-100 focus:ring-gray-400 cursor-not-allowed"
            : "focus:ring-purple-500"
        }`}
      />
    </div>
  );
}


