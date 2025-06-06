import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const signInWithGoogle = async (rememberMe) => {
  try {
    // Set the correct persistence before login
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

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
    localStorage.removeItem("rememberMe");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { auth, signInWithGoogle, logout };
