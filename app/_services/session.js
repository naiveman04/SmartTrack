import axios from "axios";
import { ref, onValue, off, remove } from "firebase/database";
import { realtimeDb,  } from "@/lib/firebase";

// ✅ activate session and close session
export async function toggleSessionAPI(teacherId, division, action, subject) {
  try {
    // ✅ Validate input
    if (!teacherId || !division || !action || (action === "open" && !subject)) {
      return { success: false, message: "Data is missing. Try again." };
    }

    // ✅ Send API request
    const response = await axios.patch("/api/session", {
      teacherId,
      division,
      action,
      subject,
    });

    // ✅ Handle response
    if (response.status === 200) {
      return {
        success: true,
        message:
          response.data.message ||
          (action === "open"
            ? "Session Activated Successfully"
            : "Session Closed Successfully"),
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Unexpected error occurred.",
      };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network Server Issue";
    return { success: false, message };
  }
}

//✅  Fetch Specifiv Divison Data From Firebase Realtime Session Cards Data
export function fetchSessionDivisionDataAPI(division, callback) {
  const sessionRef = ref(realtimeDb, `session/${division}`);

  const listener = onValue(
    sessionRef,
    (snapshot) => {
      try {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          callback({});
        }
      } catch (error) {
        callback(null);
      }
    },
    (error) => {
      callback(null);
    }
  );
  return () => off(sessionRef, "value", listener);
}

// fetch live present students
export async function fetchLiveAttendanceAPI(division, callback) {
  if (!division) {
    console.error("Division is required");
    return;
  }

  const sessionRef = ref(realtimeDb, `session/${division}/presentStudents`);

  // Real-time listener
  const listener = onValue(
    sessionRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val()); 
      } else {
        callback({}); 
      }
    },
    (error) => {
      console.error("Firebase error:", error);
      callback(null); 
    }
  );

  return () => off(sessionRef);
}

// Fetch Division Attendance from FireStore
export async function fetchAttendanceAPI(division) {
  try {
    const response = await axios.get(`/api/session/${division}`);

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data?.message || "Unknown error occurred",
      };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Network error",
    };
  }
}

export async function removeStudent(division, id) {
  console.log("Deleting student:", division, id);
  
  try { 
    const studentRef = ref(realtimeDb, `session/${division}/presentStudents/${id}`);
    await remove(studentRef);
    return { success: true, message: "Student deleted successfully." };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, message: "Failed to delete student.", error };
  }
}
