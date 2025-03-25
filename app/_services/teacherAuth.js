import axios from "axios";
import { signIn } from "next-auth/react";

export async function TeacherAuth({ email, password }) {
  // Early return for empty fields
  if (!email || !password) {
    return { success: false, message: "All fields are required" };
  }

  try {
    // Post data to the API for authentication
    const response = await axios.post("/api/teacher/auth", { email });

    // Check for errors in the API response
    if (response.status !== 200 || !response.data.id) {
      return {
        success: false,
        message: response.data.message || "Not Accessible Person",
      };
    }

    // Attempt to sign in using credentials
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      id: response.data.id,
    });

    // Handle sign-in failure
    if (res?.error) {
      return {
        success: false,
        message: res.error || "Authentication failed",
      };
    }

    // If successful, return a success message
    return { success: true, message: "Authentication successful" };
  } catch (error) {
    // Return a detailed error message
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Server Error",
    };
  }
}

