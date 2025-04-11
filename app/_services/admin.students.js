import axios from "axios";

//✅ Get All Students Data from firestore as per division
export async function fetchStudentDataAPI(division) {
  if (!division) {
    return { success: false, message: "Please Select a Division" };
  }

  try {
    const response = await axios.get(`/api/admin/${division}/records`);

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed To fetch data Try again",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Server Error",
    };
  }
}

//✅ Update Student Data API
export async function updateStudentAPI(selectedStudent, division) {
  try {
    const response = await axios.patch(
      `/api/admin/${division}/records`,
      selectedStudent
    );
 

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data?.message || "Unknown error occurred",
      };
    }

    return { success: true, message: "Updated Sucessfully" };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
}

// ✅ Update Student Data API
export async function deleteStudentAPI(rfidNumber, division) {
  try {
    const response = await axios.delete(`/api/admin/${division}/records`, {
      data: { rfidNumber },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data?.message || "Unknown error occurred",
      };
    }

    return { success: true, message: "Deleted Sucessfully" };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
}

// ✅ Add New Student
export async function addNewStudentAPI(studentData) {
  try {
    const response = await axios.post(
      `/api/admin/${studentData.division}/records`,
      studentData
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data?.message || "Unknown error occurred",
      };
    }

    return {
      success: true,
      message: response.data.message || "Student added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
}