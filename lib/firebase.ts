import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const rawStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
const normalizedBucketHost = rawStorageBucket
  .replace(/^https?:\/\//, "")
  .replace(/^gs:\/\//, "")
  .replace(/\/.*$/, "")
  .trim();
const storageBucketUrl = normalizedBucketHost ? `gs://${normalizedBucketHost}` : "";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  storageBucket: normalizedBucketHost || undefined,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = storageBucketUrl ? getStorage(app, storageBucketUrl) : getStorage(app);
