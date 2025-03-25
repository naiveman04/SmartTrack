import axios from "axios";

// ✅ Add New Teacher
export async function addNewTeacherAPI(teacherData) {
  try {
    const response = await axios.post("/api/admin/teacher", teacherData);

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data?.message || "Unknown error occurred",
      };
    }

    return {
      success: true,
      message: response.data.message || "Teacher added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
}

export async function fetchTeachersAPI() {
  try {
    const response = await axios.get("/api/admin/teacher");
    console.log(response);
    
    const { status, data } = response;

    if (status !== 200) {
      return {
        success: false,
        message: data?.message || "Unknown error occurred",
      };
    }

    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
}

export async function updateTeacherAPI(selectedTeacher) {
  try {
    const response = await axios.patch("/api/admin/teacher", selectedTeacher);

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

export async function deleteTeacherAPI(selectedTeacher) {
  const { id, loginId } = selectedTeacher;
  try {
    const response = await axios.delete("/api/admin/teacher", {
      data: { id, loginId },
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
