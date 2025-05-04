import React from "react";
import { signInWithGoogle } from "../utils/firebaseAuth";

export default function Login() {
  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/"; // direct redirect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Tokritrack Login</h1>
        <p className="text-gray-500 text-sm">
          Sign in to manage your expenses and wishlist
        </p>
        <button
          onClick={handleLogin}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
