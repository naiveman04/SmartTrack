import { db, realtimeDb } from "@/lib/firebase";
import { ref, runTransaction } from "firebase/database";
import {
  getDoc,
  doc,
  writeBatch,
  deleteDoc,
  increment,
  updateDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// ✅ Add New Student To Division
export async function POST(request, { params }) {
  const { division } = await params;
  const { rfidNumber, name, rollNo } = await request.json();

  if (!division || !rfidNumber || !name || !rollNo) {
    return NextResponse.json({
      status: 400,
      message: "Missing Data",
    });
  }

  try {
    const studentRef = doc(db, `students/${division}/records`, rfidNumber);
    const studentSnap = await getDoc(studentRef);

    // Check if student already exists
    if (studentSnap.exists()) {
      return NextResponse.json({
        status: 409,
        message: "RFID number already exists!",
      });
    }

    await setDoc(studentRef, {
      rollNo,
      name,
      attendance: {},
    });

    // YUpdates in Realtime in realtime
    const realDivisionRef = ref(
      realtimeDb,
      `generalData/${division}/totalStudents`
    );
    await runTransaction(realDivisionRef, (currentCount) => {
      return (currentCount || 0) + 1;
    });

    return NextResponse.json({
      status: 200,
      message: "Student added successfully!",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Server error: " + error.message,
    });
  }
}

// ✅ Update Student From Division
export async function PATCH(request, { params }) {
  const { division } = await params;
  const { rfidNumber, name, rollNo } = await request.json();

  if (!rfidNumber || !division) {
    return NextResponse.json({
      status: 400,
      message: "Missing teacher ID",
    });
  }
  try {
    const studentRef = doc(db, `students/${division}/records/${rfidNumber}`);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Prepare update fields dynamically
    const updatedFields = {
      ...(rollNo && { rollNo }),
      ...(name && { name }),
    };

    // Ensure at least one field is provided for update
    if (Object.keys(updatedFields).length === 0) {
      return NextResponse.json({
        message: "No valid fields provided for update",
        status: 400,
      });
    }

    // Perform update
    await updateDoc(studentRef, updatedFields);

    return NextResponse.json({
      message: "Student updated successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Internal Server Error",
      status: 500,
    });
  }
}

// ✅Delete Student
export async function DELETE(request, { params }) {
  // Extract nested params
  const { division } = await params;
  const { rfidNumber, adminKey } = await request.json();

  if (!division || !rfidNumber) {
    return NextResponse.json(
      { message: "Missing division or RFID number" },
      { status: 400 }
    );
  }

  // if (adminKey !== process.env.ADMIN_KEY) {
  //   return NextResponse.json(
  //     { message: "Not Authororized Person" },
  //     { status: 400 }
  //   );
  // }

  try {
    // Reference to Firestore document
    const studentRef = doc(db, "students", division, "records", rfidNumber);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      return NextResponse.json(
        { message: "No Student Found" },
        { status: 400 }
      );
    }

    // Delete document
    await deleteDoc(studentRef);

    //cahnge in realtime database
    const realDivisionRef = ref(
      realtimeDb,
      `generalData/${division}/totalStudents`
    );
    await runTransaction(realDivisionRef, (currentCount) => {
      return (currentCount || 0) > 0 ? currentCount - 1 : 0;
    });

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete student" },
      { status: 500 }
    );
  }
}

// Get Specific Division all students
export async function GET(request, { params }) {

  
  const { division } = await params;

  if (!division) {
    return NextResponse.json({ message: "Missing Fields" }, { status: 400 });
  }

  try {
    const divisionRef = doc(db, "students", division);
    const divisionSnap = await getDoc(divisionRef);

    if (!divisionSnap.exists()) {
      return NextResponse.json(
        { message: "No Division Exist" },
        { status: 400 }
      );
    }
    const divisionData = divisionSnap.data();
    const subjects = divisionData.subjects || [];

    const studentRef = collection(db, "students", division, "records");
    const studentsSnap = await getDocs(studentRef);

    if (studentsSnap.empty) {
      return NextResponse.json(
        { message: "No Students Found" },
        { status: 400 }
      );
    }

    let students = [];
    studentsSnap.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ subjects, students }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch division data" },
      { status: 500 }
    );
  }
}
