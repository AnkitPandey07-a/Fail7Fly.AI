
import { cert, initializeApp, getApps } from "firebase-admin/app";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin credentials in environment variables"
  );
}

export const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
