"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { realtimeDb } from "@/lib/firebase";

// Create context with an initial value to avoid undefined errors
const SessionContext = createContext({
  error: null,
  sessionData: [],
});

// Create provider component
export default function SessionContextProvider({ children }) {
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState([]);

  useEffect(() => {
    const generalSessionRef = ref(realtimeDb, "generalData");

    const listener = onValue(
      generalSessionRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const transformedData = Object.entries(data).map(([key, value]) => ({
            id: key, // Add the key as 'id'
            ...value, // Spread the object properties
          }));
          setSessionData(transformedData);
        } else {
          setSessionData([]); // Ensure it's always an array
        }
      },
      (error) => {
        console.error("Error fetching session data:", error);
        setError("Failed to fetch session data");
      }
    );
    // Cleanup listener when component unmounts
    return () => off(generalSessionRef, "value", listener);
  }, []);

  return (
    <SessionContext.Provider value={{ error, sessionData }}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook for using session data
export function useSessionContext() {
  return useContext(SessionContext);
}
