import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
import {
  isTeacherIdValid,
  getSessionDetails,
  activateSession,
  closeSession,
  sessionRequestMatch,
} from "../_services/session";

//✅Creates and Ends Session
export async function PATCH(request) {
  const { teacherId, division, action, subject } = await request.json();

  //  Validate request data
  if (!teacherId || !division || !action || (action === "open" && !subject)) {
    return NextResponse.json(
      { message: "Missing or invalid data" },
      { status: 400 }
    );
  }

  try {
    // Validate teacher ID
    const teacherData = await isTeacherIdValid(teacherId);
    if (!teacherData) {
      return NextResponse.json(
        { message: "Invalid Teacher ID" },
        { status: 409 }
      );
    }

    //  Check session details
    const sessionDetails = await getSessionDetails(division);
    if (action === "open") {
      if (sessionDetails?.status) {
        return NextResponse.json(
          { message: `Session Already Active for ${division} division` },
          { status: 409 }
        );
      }

      const success = await activateSession(
        division,
        teacherData.id,
        teacherData.data.name,
        subject
      );
      return NextResponse.json(
        {
          message: success
            ? "Session activated successfully"
            : "Session activation failed",
        },
        { status: success ? 200 : 500 }
      );
    }

    // Action Close Session
    else if (action === "close") {
      if(!sessionDetails){
        return NextResponse.json(
          {message: `No current active session for division ${division}`},
          {status: 400}
        )
      }
      const isAuthorized = await sessionRequestMatch(teacherData.id, division);

      if (!isAuthorized) {
        return NextResponse.json(
          { message: "Not authorized to close session" },
          { status: 409 }
        );
      }

      const success = await closeSession(
        division,
        sessionDetails.sessionActiveSubject
      );
      return NextResponse.json(
        {
          message: success
            ? "Session closed successfully"
            : "Failed to close session",
        },
        { status: success ? 200 : 500 }
      );
    }

    return NextResponse.json(
      { message: "Invalid action. Use 'open' or 'close'" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

