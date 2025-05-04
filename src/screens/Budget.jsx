import React, { useEffect, useState, useRef } from "react";
import db from "../utils/firebaseDB";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  Timestamp,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import html2pdf from "html2pdf.js";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Budget() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    tag: "planned",
  });
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [budgetInfo, setBudgetInfo] = useState(null);
  const printRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchExpenses = async () => {
    if (!user) return;
    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setExpenses(data);
  };

  const fetchBudget = async () => {
    if (!user) return;
    const currentMonth = year + "-" + String(month + 1).padStart(2, "0");
    const q = query(
      collection(db, "monthlyBudgets"),
      where("userId", "==", user.uid),
      where("month", "==", currentMonth)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      const defaultCategories = [
        { name: "Food", limit: 300 },
        { name: "Transport", limit: 200 },
        { name: "Shopping", limit: 500 },
      ];
      await addDoc(collection(db, "monthlyBudgets"), {
        userId: user.uid,
        month: currentMonth,
        totalBudget: 1000,
        createdAt: serverTimestamp(),
        categories: defaultCategories,
      });
      setBudgetInfo({ totalBudget: 1000, categories: defaultCategories });
    } else {
      const data = snapshot.docs[0].data();
      setBudgetInfo(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudget();
  }, []);

  useEffect(() => {
    const filtered = expenses.filter((item) => {
      const date = item.created_at?.toDate?.();
      return (
        date &&
        date.getMonth() === parseInt(month) &&
        date.getFullYear() === parseInt(year)
      );
    });
    setFilteredExpenses(filtered);
    fetchBudget();
  }, [month, year, expenses]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    await addDoc(collection(db, "expenses"), {
      amount: Number(form.amount),
      category: form.category,
      tag: form.tag,
      userId: user.uid,
      created_at: Timestamp.now(),
    });
    setForm({ amount: "", category: "", tag: "planned" });
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    fetchExpenses();
  };

  const categoryData = filteredExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#60a5fa",
          "#facc15",
          "#34d399",
          "#f87171",
          "#a78bfa",
          "#fb923c",
        ],
        borderWidth: 1,
      },
    ],
  };

  const exportToPDF = () => {
    const element = printRef.current;
    html2pdf().from(element).save("expenses.pdf");
  };

  const exportToCSV = () => {
    const rows = [["Amount", "Category", "Tag"]];
    filteredExpenses.forEach((item) => {
      rows.push([item.amount, item.category, item.tag]);
    });
    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Budget Tracker</h1>

      {budgetInfo && (
        <div className="bg-blue-50 p-3 rounded mb-4">
          <p>
            <strong>Total Budget:</strong> ${budgetInfo.totalBudget}
          </p>
          <p>
            <strong>Categories:</strong>{" "}
            {budgetInfo.categories.map((c) => c.name).join(", ")}
          </p>
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 space-y-4"
      >
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <select
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="planned">Planned</option>
          <option value="impulse">Impulse</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </form>

      <div className="flex gap-4 mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[...Array(12)].map((_, idx) => (
            <option key={idx} value={idx}>
              {new Date(0, idx).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
        >
          {[...Array(5)].map((_, idx) => {
            const y = new Date().getFullYear() - 2 + idx;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={exportToPDF}
          className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
        >
          Download PDF
        </button>
        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm ml-2"
        >
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={printRef}>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-2">Expenses</h2>
          <ul className="space-y-3">
            {filteredExpenses.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    ${e.amount} · {e.category}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {e.tag}
                  </p>
                </div>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => handleDelete(e.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-2">Spending by Category</h2>
          {Object.keys(categoryData).length ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              No data yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
