import { db } from "@/lib/firebase";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";
import { auth } from "firebase-admin";
import { getAuth } from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { findTeacherExist } from "../../_services/teacher";

// ✅ teacher is created by admin
export async function POST(request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const teacherData = await findTeacherExist(email);

    if (teacherData !== null) {
      return NextResponse.json(
        { message: "Teacher with this email already exists" },
        { status: 400 }
      );
    }

    const teacherRef = doc(collection(db, "teachers"));

    // Store teacher data in Firestore
    await setDoc(teacherRef, {
      name,
      email,
      createdAt: new Date().toISOString(),
      isVerified: false,
    });

    return NextResponse.json({
      message: "New Teacher Added Successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Server error: " + error.message,
      status: 500,
    });
  }
}

// ✅ Fetch All Teachers
export async function GET(request) {
  try {
    const teachersRef = collection(db, "teachers");
    const querySnapshot = await getDocs(teachersRef);

    const data = querySnapshot.docs.map((doc) => {
      const { name, email, isVerified, uid } = doc.data();
      return {
        id: doc.id,
        name,
        email,
        isVerified,
        loginId: uid,
      };
    });

    return NextResponse.json({
      status: 200,
      message: "Teachers fetched successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}

// ✅ Delete Teacher
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({
        status: 400,
        message: "Missing teacher ID",
      });
    }

    const teacherRef = doc(db, "teachers", id);
    const teacherSnap = await getDoc(teacherRef);

    if (!teacherSnap.exists()) {
      return NextResponse.json(
        { message: "No Teacher Found" },
        { status: 400 }
      );
    }

    await deleteDoc(teacherRef);

    return NextResponse.json({
      status: 200,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error.message || "Failed to delete Teacher",
    });
  }
}

// ✅ Allow Teacher to set new Password
export async function PATCH(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing teacher ID" },
        { status: 400 }
      );
    }

    const teacherRef = doc(db, "teachers", id);
    const teacherSnap = await getDoc(teacherRef);

    if (!teacherSnap.exists()) {
      return NextResponse.json(
        { message: "No Teacher Found" },
        { status: 400 }
      );
    }

    const updatedData = {
      ...teacherSnap.data(),
      isVerified: false,
      password: deleteField(),
    };

    await updateDoc(teacherRef, updatedData);

    return NextResponse.json(
      { message: "Teacher updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
