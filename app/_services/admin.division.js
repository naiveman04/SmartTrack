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

export async function addNewDivisionAPI(divisionData) {
  
  const { division, subjects } = divisionData;

  try {
    //**Validation checks**
    if (!division || division.trim() === "") {
      return {
        success: false,
        message: "Division name is required.",
      };
    }    

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return {
        success: false,
        message: "At least one subject must be added.",
      };
    }

    // **Make POST request**
    const { data } = await axios.post(`api/admin/${division}`, {
      division,
      subjects,
    });

    console.log(data);
    
    return {
      success: true,
      message: "Division added successfully!",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while adding the division.",
    };
  }
}
