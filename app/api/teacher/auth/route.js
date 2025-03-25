import { NextResponse } from "next/server";
import { checkTeacherEmail } from "../../_services/teacher";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findTeacherExist } from "../../_services/teacher";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const email = searchParams.get("email");

//   try {
//     if (!email) {
//       return NextResponse.json(
//         {
//           message: "Missing email parameter",
//         },
//         { status: 400 }
//       );
//     }

//     const teachersCollection = collection(db, "teachers");
//     const q = query(teachersCollection, where("email", "==", email));
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       return NextResponse.json({ message: "Invalid email" }, { status: 404 });
//     }

//     const docSnapshot = querySnapshot.docs[0];
//     const teacherData = docSnapshot.data();

//     return NextResponse.json(
//       {
//         message: "Email Found",
//         id: teacherData.id,
//         teacherData,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: "Server Error: " + error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const teacherId = await findTeacherExist(email);

    if (!teacherId) {
      return NextResponse.json(
        { message: "Not Accessible Person" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Teacher Account Exists",
        id: teacherId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal " }, { status: 500 });
  }
}
