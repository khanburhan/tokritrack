import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    return null;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { auth, signInWithGoogle, logout };
