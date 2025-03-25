import admin from 'firebase-admin'

const serviceAccount = {
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.PUBLIC_FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  })
}

export const adminDB = admin.firestore();
export const adminAuth = admin.auth();