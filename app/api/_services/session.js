import { db, realtimeDb } from "@/lib/firebase";
import { get, ref, update, set, remove } from "firebase/database";
import { doc, getDoc, increment, writeBatch } from "firebase/firestore";

// ✅ Validate if teacher ID exists returns teacherdata
export async function isTeacherIdValid(teacherId) {
  try {
    const teacherRef = doc(db, "teachers", teacherId);
    const teacherSnap = await getDoc(teacherRef);

    if (teacherSnap.exists()) {
      return {
        id: teacherSnap.id,
        data: teacherSnap.data(),
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

// ✅ Fetch session details from the Realtime Database
export async function getSessionDetails(division) {
  try {
    const sessionRef = ref(realtimeDb, `session/${division}`);
    const snapShot = await get(sessionRef);

    return snapShot.exists() ? snapShot.val() : null;
  } catch (error) {
    return null;
  }
}

// ✅ Function to activate session with rollback
export async function activateSession(division, id, name, subject) {
  try {
    const sessionRef = ref(realtimeDb, `session/${division}`);
    const generalDataRef = ref(realtimeDb, `generalData/${division}`);

    const sessionSnap = await get(sessionRef);
    const previousSessionData = sessionSnap.exists() ? sessionSnap.val() : null;

    if (previousSessionData?.status) {
      return false;
    }

    // Update Realtime Database Session
    await update(sessionRef, { status: true, sessionActiveSubject: subject });

    // Update RealTime Database GeneralData
    await update(generalDataRef, {
      status: true,
      sessionStartedAt: Date.now(),
      sessionTeacherName: name,
      sessionTeacherId: id,
      sessionActiveSubject: subject,
      sessionEndedAt: null,
    });

    return true;
  } catch (error) {
    if (previousSessionData) {
      await update(sessionRef, previousSessionData);
    }
    return false;
  }
}

//✅ Function to check if same teacher creates Session
export async function sessionRequestMatch(teacherId, division) {
  try {
    const generalDataRef = ref(realtimeDb, `generalData/${division}`);
    const snapShot = await get(generalDataRef);

    if (snapShot.exists()) {
      const sessionData = snapShot.val();
      if (sessionData.sessionTeacherId === teacherId && sessionData.status) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

// ✅Function to Close Session
export async function closeSession(division, activeSubject) {
  const batch = writeBatch(db);

  try {
    const presentStudentsRef = ref(
      realtimeDb,
      `session/${division}/presentStudents`
    );
    const presentSnap = await get(presentStudentsRef);

    const presentStudentIds = presentSnap.exists()
      ? Object.keys(presentSnap.val())
      : [];

    // Update attendance in Firestore only if students exist
    if (presentStudentIds.length > 0) {
      for (const rfidNumber of presentStudentIds) {
        const studentAttendanceRef = doc(
          db,
          `students/${division}/records`,
          rfidNumber
        );
        batch.set(
          studentAttendanceRef,
          { attendance: { [activeSubject]: increment(1) } },
          { merge: true }
        );
      }
      await batch.commit();
    }

    // Step Update session status in Realtime Database after Firestore commit
    await remove(ref(realtimeDb, `session/${division}`));

    const generalDataRef = ref(realtimeDb, `generalData/${division}`);
    const generalDataVal = await get(generalDataRef);
    const generalData = generalDataVal.val() || {};

    const totalStudents = generalData.totalStudents || 1;
    const totalSessions = generalData.totalSessions || 0;
    const averageAttendance = generalData.averageAttendance || 0;

    // Calculate session attendance percentage
    const sessionAverage = presentStudentIds.length / totalStudents;

    const newAverageAttendance =
      (averageAttendance * totalSessions + sessionAverage) /
      (totalSessions + 1);

    // update general store
    await update(generalDataRef, {
      status: false,
      sessionStartedAt: null,
      sessionTeacherName: "",
      sessionTeacherId: "",
      sessionActiveSubject: "",
      sessionEndedAt: Date.now(),
      totalSessions: totalSessions + 1,
      averageAttendance: newAverageAttendance,
    });

    return true;
  } catch (error) {
    return false;
  }
}
