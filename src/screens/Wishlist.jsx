import React, { useState, useEffect, useRef } from "react";
import db from "../utils/firebaseDB";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import html2pdf from "html2pdf.js";

// ...imports remain the same

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", urgency: "low" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const printRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchWishlist = async () => {
    if (!user) return;
    const q = query(
      collection(db, "wishlist"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      reviewAfter: doc.data().reviewAfter?.toDate?.(),
    }));
    setItems(list);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return;

    const payload = {
      title: form.title,
      price: Number(form.price),
      urgency: form.urgency,
      userId: user.uid,
      reviewAfter: Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ),
    };

    if (editingId) {
      await updateDoc(doc(db, "wishlist", editingId), payload);
    } else {
      await addDoc(collection(db, "wishlist"), payload);
    }

    setForm({ title: "", price: "", urgency: "low" });
    setEditingId(null);
    fetchWishlist();
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, price: item.price, urgency: item.urgency });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "wishlist", id));
    fetchWishlist();
  };

  const exportToCSV = () => {
    const rows = [["Title", "Price", "Urgency"]];
    filteredItems.forEach((item) => {
      rows.push([item.title, item.price, item.urgency]);
    });
    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "wishlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const element = printRef.current;
    html2pdf().from(element).save("wishlist.pdf");
  };

  const filteredItems = items.filter((item) => {
    const matchTitle = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchUrgency = urgencyFilter ? item.urgency === urgencyFilter : true;
    return matchTitle && matchUrgency;
  });

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Item Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <select
          value={form.urgency}
          onChange={(e) => setForm({ ...form, urgency: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="low">Low Urgency</option>
          <option value="medium">Medium Urgency</option>
          <option value="high">High Urgency</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Urgencies</option>
          <option value="low">Low Urgency</option>
          <option value="medium">Medium Urgency</option>
          <option value="high">High Urgency</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm("");
            setUrgencyFilter("");
          }}
          className="bg-gray-200 px-3 py-2 rounded text-sm"
        >
          Clear
        </button>
      </div>

      {/* Export */}
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

      {/* Wishlist items */}
      <div ref={printRef}>
        <ul className="space-y-3">
          {filteredItems.map((item) => {
            const isReviewReady =
              item.reviewAfter && new Date(item.reviewAfter) <= new Date();

            return (
              <li
                key={item.id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-600">
                    ${item.price} · {item.urgency}
                  </p>
                  {isReviewReady && (
                    <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Ready for Review
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
