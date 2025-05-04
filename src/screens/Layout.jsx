import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { logout } from "../utils/firebaseAuth";
import ThemeToggle from "../../components/ThemeToggle"; // adjust path as needed

import {
  FiHome,
  FiHeart,
  FiPieChart,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Layout() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <FiHome className="mr-2" /> },
    {
      path: "/wishlist",
      label: "Wishlist",
      icon: <FiHeart className="mr-2" />,
    },
    { path: "/budget", label: "Budget", icon: <FiPieChart className="mr-2" /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout().then(() => (window.location.href = "/login"));
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Overlay backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg fixed md:static z-40 top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 font-bold text-xl border-b flex justify-between items-center md:block">
          Tokritrack
          <button
            className="md:hidden text-gray-600"
            onClick={() => setDrawerOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded hover:bg-gray-100 ${
                isActive(item.path) ? "bg-gray-200 font-semibold" : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-8 text-red-600 flex items-center px-4 py-2 hover:bg-red-100 rounded"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile header */}
        <div className="md:hidden p-4 bg-white shadow sticky top-0 z-20 flex justify-between items-center">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-2xl font-bold"
          >
            <FiMenu />
          </button>
          <span className="font-semibold">Tokritrack</span>
        </div>

        {/* Screen content */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
// Then inside your layout:
<ThemeToggle />;
