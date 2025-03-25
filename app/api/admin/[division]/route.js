import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { realtimeDb } from "@/lib/firebase";
import { ref, set } from "firebase/database";

// ✅ admin action adds new Division
export async function POST(request, { params }) {
  try {
    const { subjects } = await request.json();
    const { division } = await params;
    // Validate input
    if (
      !division ||
      !subjects ||
      !Array.isArray(subjects) ||
      subjects.length === 0
    ) {
      return NextResponse.json(
        { message: "Invalid division name or subjects" },
        { status: 400 }
      );
    }

    const studentsRef = doc(db, "students", division);
    const docSnapShot = await getDoc(studentsRef);

    // Check if division already exists
    if (docSnapShot.exists()) {
      return NextResponse.json(
        { message: "Division already exists!" },
        { status: 400 }
      );
    }

    // Create the New Division With Subject Array And totalStidents 0
    await setDoc(studentsRef, { subjects });

    // Store session data in Realtime Database
    const sessionRef = ref(realtimeDb, `generalData/${division}`);
    await set(sessionRef, {
      sessionTeacherName: "",
      sessionTeacherId: "",
      sessionActiveSubject: "",
      totalStudents: 0,
      averageAttendance: 0,
      subjects,
    });

    return NextResponse.json(
      {
        message: `New Division ${division} created successfully!`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// ✅ add subject
export async function PATCH(request, { params }) {
  const { adminKey, subject } = await request.json();
  const { division } = await params;

  if (!division || !subject) {
    return NextResponse.json({ message: "Missing Fields" }, { status: 400 });
  }

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { message: "Not Authororized Person" },
      { status: 400 }
    );
  }

  try {
    const divisionRef = doc(db, "students", division);
    const divisionSnap = await getDoc(divisionRef);

    if (!divisionSnap.exists()) {
      return NextResponse.json(
        { message: "No Division Found" },
        { status: 404 }
      );
    }

    const divisionData = divisionSnap.data();
    const currentSubjects = divisionData.subjects || [];

    const duplicateSubject = currentSubjects.find((sub) => sub === subject);

    if (duplicateSubject) {
      return NextResponse.json(
        { message: "Subject already present" },
        { status: 400 }
      );
    }

    const updatedSubject = [...currentSubjects, subject];

    await updateDoc(divisionRef, { subjects: updatedSubject });

    const subjectRef = ref(realtimeDb, `generalData/${division}/subjects`);
    await set(subjectRef, updatedSubject);

    return NextResponse.json(
      {
        message: "Subjects updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}

//✅ Delete Subject From Division
// export async function DELETE(request) {
//   try {
//     const { division, adminKey } = await request.json();

//     if (!division) {
//       return NextResponse.json(
//         { message: "Division is required!" },
//         { status: 400 }
//       );
//     }

//     if (adminKey !== process.env.ADMIN_KEY) {
//       return NextResponse.json(
//         { message: "Not Authororized Person" },
//         { status: 400 }
//       );
//     }

//     // Delete Subject and Students
//     const studentsRef = doc(db, "students", division);
//     await deleteDoc(studentsRef);

//     // 🔹 Realtime Database: Delete session data
//     const sessionRef = ref(realtimeDb, `session/${division}`);
//     await remove(sessionRef);

//     return NextResponse.json(
//       { message: `Division ${division} deleted successfully!` },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

// ✅ GEt all Divisions Genearl Data (division, subjects)
export async function GET(request) {
  try {
    const divisionRef = collection(db, "students");
    const divisionSnap = await getDocs(divisionRef);

    if (divisionSnap.empty) {
      return NextResponse.json(
        { message: "No Division Found" },
        { status: 400 }
      );
    }

    let divisionData = [];
    divisionSnap.forEach((doc) => {
      divisionData.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ divisionData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch division data" },
      { status: 500 }
    );
  }
}
