import { db, realtimeDb } from "@/lib/firebase";
import { get, ref, set } from "firebase/database";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// RFID Card Scanner
export async function PATCH(request, { params }) {
  try {
    const { division } = params;
    const { rfid } = await request.json();

    if (!rfid) {
      return NextResponse.json(
        { message: "RFID is required" },
        { status: 400 }
      );
    }

    // Fetch student record from Firestore
    const studentRef = doc(db, `students/${division}/records`, rfid);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      return NextResponse.json(
        { message: "Invalid Card Swap" },
        { status: 404 }
      );
    }

    // Check if session is active
    const sessionRefStatus = ref(realtimeDb, `session/${division}`);
    const sessionSnapshot = await get(sessionRefStatus);

    if (!sessionSnapshot.exists()) {
      return NextResponse.json(
        { message: "Session is closed" },
        { status: 400 }
      );
    }

    // Add student attendance to Realtime Database
    const studentAttendanceRef = ref(
      realtimeDb,
      `session/${division}/presentStudents/${rfid}`
    );

    await set(studentAttendanceRef, {
      ...studentDoc.data(),
    });

    return NextResponse.json(
      { message: "Student added to attendance" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ReturnsDivision Wise Class Attendance from FireStore
export async function GET(request, { params }) {
  try {
    const { division } = await params;

    // Check if division parameter exists
    if (!division) {
      return NextResponse.json(
        { message: "Division parameter is required." },
        { status: 400 }
      );
    }

    // Fetch student records
    // Fetch division metadata
    const divisionRef = doc(db, "students", division);
    const divisionSnapShot = await getDoc(divisionRef);

    if (!divisionSnapShot.exists()) {
      return new NextResponse(
        JSON.stringify({ message: "Division not found." }),
        { status: 404 }
      );
    }

    const commonDivisionData = divisionSnapShot.data();
    const subjects = commonDivisionData.subjects || [];

    // Fetch student records
    const studentsRef = collection(db, "students", division, "records");
    const querySnapshot = await getDocs(studentsRef);

    if (querySnapshot.empty) {
      return new NextResponse(
        JSON.stringify({
          message: `No students found in division ${division}.`,
        }),
        { status: 404 }
      );
    }

    // Map student data
    const students = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new NextResponse(JSON.stringify({ data: { subjects, students } }), {
      status: 200,
    });
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({
      status: 500,
      message: error.message || "Failed to fetch students.",
    });
  }
}
