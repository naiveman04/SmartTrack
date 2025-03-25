import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function findTeacherExist(email) {
  try {
    // Query the teachers collection for matching email
    const teachersRef = collection(db, "teachers");
    const q = query(teachersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    // If no teacher found, return null
    if (querySnapshot.empty) {
      return null;
    }

    // If teacher found, return the document id
    const docSnapshot = querySnapshot.docs[0];
    const teacherId = docSnapshot.id;

    return teacherId;

  } catch (error) {
    return null; 
  }
}

    