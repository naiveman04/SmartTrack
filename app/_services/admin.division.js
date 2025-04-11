import axios from "axios";

// fetch general division data
export async function fetchDivisionGeneralDataAPI() {
  try {
    const response = await axios.get("/api/admin/TE7");

    if (response.status !== 200) {
      return {
        success: false,
        message: response?.data?.message || "Try Again",
      };
    }

    return {
      success: true,
      data: response?.data?.divisionData || [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching divisions.",
    };
  }
}

// add new subject
export async function addNewSubjectAPI(subject, division) {
  try {
    if (!subject?.trim()) {
      return {
        success: false,
        message: "Subject is required",
      };
    }

    const response = await axios.patch(`/api/admin/${division}`, { subject });
    console.log(response);
    
    return {
      success: response.status === 200,
      message: response?.data?.message || 
               (response.status === 200 ? "Subject added successfully" : "Try again"),
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while adding the subject.",
    };
  }
}
