import React, { useEffect, useState } from "react";
import db from "../utils/firebaseDB";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

Chart.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [impulseCount, setImpulseCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const expensesSnapshot = await getDocs(collection(db, "expenses"));
      const wishlistSnapshot = await getDocs(collection(db, "wishlist"));

      const exp = [];
      let impulse = 0;

      expensesSnapshot.forEach((doc) => {
        const data = doc.data();
        exp.push({ ...data, created_at: data.created_at?.toDate() });
        if (data.tag === "impulse") impulse++;
      });

      setExpenses(exp);
      setImpulseCount(impulse);
      setWishlistCount(wishlistSnapshot.size);
    };

    fetchData();
  }, []);

  const impulseVsPlanned = {
    labels: ["Planned", "Impulse"],
    datasets: [
      {
        data: [
          expenses.filter((e) => e.tag === "planned").length,
          expenses.filter((e) => e.tag === "impulse").length,
        ],
        backgroundColor: ["#10b981", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const categoryTotals = expenses.reduce((acc, curr) => {
    const date = new Date(curr.created_at);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    acc[day] = (acc[day] || 0) + curr.amount;
    return acc;
  }, {});

  const spendingTrends = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Spending",
        data: Object.values(categoryTotals),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Live overview
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-2">
            Total Expenses
          </h2>
          <p className="text-2xl font-bold text-green-600">
            ${expenses.reduce((a, b) => a + (b.amount || 0), 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-2">
            Wishlist Items
          </h2>
          <p className="text-2xl font-bold text-blue-600">
            {wishlistCount} Items
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-2">
            Impulse Purchases
          </h2>
          <p className="text-2xl font-bold text-red-500">
            {impulseCount} flagged
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
          <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-2">
            Spending Trends
          </h2>
          {Object.keys(spendingTrends.labels).length ? (
            <Bar data={spendingTrends} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-6">
              No data yet.
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
          <h2 className="text-lg font-medium text-gray-700 dark:text-white mb-2">
            Impulse vs Planned
          </h2>
          <Pie data={impulseVsPlanned} />
        </div>
      </div>
    </div>
  );
}
