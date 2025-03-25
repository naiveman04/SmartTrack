import React from "react";

function Spinner() {
  return (
    <div className="flex justify-center items-center h-40"> 
      {/* Increased height and width, added thicker border */}
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-700 border-t-transparent" />
    </div>
  );
}

export default Spinner;

