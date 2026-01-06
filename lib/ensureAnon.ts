import { auth } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";

let signing: Promise<string> | null = null;

export async function ensureAnonUid(): Promise<string> {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  if (!signing) {
    signing = signInAnonymously(auth).then(res => res.user.uid).finally(() => {
      signing = null;
    });
  }
  return signing;
}
