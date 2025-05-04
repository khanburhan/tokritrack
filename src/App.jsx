import ThemeToggle from "../components/ThemeToggle";

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./screens/Home";
import Wishlist from "./screens/Wishlist";
import Budget from "./screens/Budget";
import Login from "./screens/Login";
import Layout from "./screens/Layout";

const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuthenticated() ? (
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/budget" element={<Budget />} />
          </Route>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/wishlist" element={<Navigate to="/login" />} />
            <Route path="/budget" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
